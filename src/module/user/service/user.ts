import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { UserEntity } from '../entity/user';
import { omit } from 'lodash';
import { UserVO } from '../vo/user';
import * as bcrypt from 'bcryptjs';
import { R } from '../../../common/base.error.util';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  getModel(): Repository<UserEntity> {
    return this.userModel;
  }

  async create(entity: UserEntity): Promise<UserVO> {
    const { userName, phone, email } = entity;
    let isExist = (await this.userModel.countBy({ userName })) > 0;
    if (isExist) throw R.error('当前用户名已存在');

    isExist = (await this.userModel.countBy({ phone })) > 0;
    if (isExist) throw R.error('当前手机号已存在');

    isExist = (await this.userModel.countBy({ email })) > 0;
    if (isExist) throw R.error('当前邮箱已存在');

    // 添加用户的默认密码是123456，对密码进行加盐加密
    const password = bcrypt.hashSync('123456', 10);
    entity.password = password;
    await this.userModel.save(entity);
    // 把entity中的password移除返回给前端
    const data = omit(entity, ['password']) as UserVO
    return data;
  }

  async edit(entity: UserEntity): Promise<UserVO> {
    const { userName, phone, email, id } = entity;
  
    let user = await this.userModel.findOneBy({ userName });
    if (user && user.id !== id) throw R.error('当前用户名已存在');

    user = await this.userModel.findOneBy({ phone });
    if (user && user.id !== id) throw R.error('当前手机号已存在');

    user = await this.userModel.findOneBy({ email });
    if (user && user.id !== id) throw R.error('当前邮箱已存在');
    await this.userModel.save(entity);

    const data = omit(entity, ['password']) as UserVO
    
    return data;
  }
}
