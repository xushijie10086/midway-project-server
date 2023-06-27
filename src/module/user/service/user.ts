/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-05 15:10:00
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-26 12:05:46
 * @FilePath: \midway-project-server\src\module\user\service\user.ts
 * @Description: 描述一下
 *
 */
import { Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { UserEntity } from '../entity/user';
import { omit } from 'lodash';
import { UserVO } from '../vo/user';
import * as bcrypt from 'bcryptjs';
import { R } from '../../../common/base.error.util';
import { FileService } from '../../file/service/file';
import { FileEntity } from '../../file/entity/file';
import { RedisService } from '@midwayjs/redis';
import { UserDTO } from '../dto/user';
import { uuid } from '../../../utils/uuid';
import { MailService } from '../../../common/mail.service';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  @InjectEntityModel(FileEntity)
  fileModel: Repository<FileEntity>;

  @Inject()
  fileService: FileService;

  @InjectDataSource()
  defaultDataSource: DataSource;

  @Inject()
  redisService: RedisService;

  @Inject()
  mailService: MailService;

  getModel(): Repository<UserEntity> {
    return this.userModel;
  }

  async createUser(userDTO: UserDTO) {
    const entity = userDTO.toEntity();
    const { userName, phone, email } = userDTO;
    let isExist = (await this.userModel.countBy({ userName })) > 0;
    if (isExist) throw R.error('当前用户名已存在');

    isExist = (await this.userModel.countBy({ phone })) > 0;
    if (isExist) throw R.error('当前手机号已存在');

    isExist = (await this.userModel.countBy({ email })) > 0;
    if (isExist) throw R.error('当前邮箱已存在');

    const emailCaptcha = await this.redisService.get(`emailCaptcha:${email}`);

    if (emailCaptcha != userDTO.emailCaptcha)
      throw R.error('邮箱验证码错误或以生效');

    // 随机生成密码，并发送到对应的邮箱中。
    const password = uuid();

    // 添加用户，对密码进行加盐加密
    const hashPassword = bcrypt.hashSync(password, 10);

    entity.password = hashPassword;

    // 使用事物
    await this.defaultDataSource.transaction(async manager => {
      await manager.save(UserEntity, entity);

      if (userDTO.avatar) {
        await manager
          .createQueryBuilder()
          .update(FileEntity)
          .set({
            pkValue: entity.id,
            pkName: 'user_avatar',
          })
          .where('id = :id', { id: userDTO.avatar })
          .execute();
      }

      this.mailService.sendMail({
        to: email,
        subject: 'midway-admin平台账号创建成功',
        html: `<div>
        <p><span style="color:#5867dd;">${userDTO.nickName}</span>，你的账号已开通成功</p>
        <p>登录地址：<a href="http://localhost/user/login">http://localhost/user/login</a></p>
        <p>登录账号：${userDTO.email}</p>
        <p>登录密码：${password}</p>
        </div>
        `,
      });
    });

    await this.userModel.save(entity);
    // 把entity中的password移除返回给前端
    const data = omit(entity, ['password']) as UserVO;
    return data;
  }

  async editUser(userDTO: UserDTO): Promise<void | UserVO> {
    const { userName, phone, email, id, nickName, sex, avatar } = userDTO;
    let user = await this.userModel.findOneBy({ userName });

    if (user && user.id !== id) {
      throw R.error('当前用户名已存在');
    }

    user = await this.userModel.findOneBy({ phone });

    if (user && user.id !== id) {
      throw R.error('当前手机号已存在');
    }

    user = await this.userModel.findOneBy({ email });

    if (user && user.id !== id) {
      throw R.error('当前邮箱已存在');
    }

    await this.defaultDataSource.transaction(async manager => {
      await manager
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          nickName,
          phone,
          sex,
        })
        .where('id = :id', { id: userDTO.id })
        .execute();

      // 根据当前用户id在文件表里查询
      const fileRecord = await this.fileModel.findOneBy({
        pkValue: id,
        pkName: 'user_avatar',
      });

      // 如果查到文件，并且当前头像是空的，只需要给原来的文件给删除就行了。
      if (fileRecord && !avatar) {
        await this.fileModel.remove(fileRecord);
      } else if (fileRecord && avatar && fileRecord.id !== avatar) {
        // 如果查到文件，并且有当前头像，并且原来的文件id不等于当前传过来的文件id
        // 删除原来的文件
        // 把当前的用户id更新到新文件行数据中
        await Promise.all([
          manager.delete(FileEntity, fileRecord.id),
          manager
            .createQueryBuilder()
            .update(FileEntity)
            .set({
              pkValue: id,
              pkName: 'user_avatar',
            })
            .where('id = :id', { id: userDTO.avatar })
            .execute(),
        ]);
      } else if (!fileRecord && avatar) {
        // 如果以前没有文件，现在有文件，直接更新就行了
        manager
          .createQueryBuilder()
          .update(FileEntity)
          .set({
            pkValue: id,
            pkName: 'user_avatar',
          })
          .where('id = :id', { id: userDTO.avatar })
          .execute();
      }
    });

    const entity = this.userModel.findOneBy({ id });
    return omit(entity, ['password']) as UserVO;
  }

  async removeUser(id: number) {
    await this.defaultDataSource.transaction(async manager => {
      const tokens = await this.redisService.smembers(`userToken_${id}`);
      const refreshTokens = await this.redisService.smembers(
        `userRefreshToken_${id}`
      );

      await Promise.all([
        manager
          .createQueryBuilder()
          .delete()
          .from(UserEntity)
          .where('id = :id', { id })
          .execute(),
        manager
          .createQueryBuilder()
          .delete()
          .from(FileEntity)
          .where('pkValue = :pkValue', { pkValue: id })
          .andWhere('pkName = "user_avatar"')
          .execute(),
        ...tokens.map(token => this.redisService.del(`token:${token}`)),
        ...refreshTokens.map(refreshToken =>
          this.redisService.del(`refreshToken:${refreshToken}`)
        ),
      ]);
    });
  }

  async page<T>(page = 0, pageSize = 10, where?: FindOptionsWhere<T>) {
    const [data, total] = await this.userModel
      .createQueryBuilder('t')
      .leftJoinAndMapOne(
        't.avatarEntity',
        FileEntity,
        'file',
        'file.pkValue = t.id and file.pkName = "user_avatar"'
      )
      .where(where)
      .skip(page)
      .take(page * pageSize)
      .orderBy('t.createDate', 'DESC')
      .getManyAndCount();

    return {
      data: data.map(entity => entity.toVO()),
      total,
    };
  }

  async getByEmail(email: string) {
    return await this.userModel.findOneBy({ email });
  }
}
