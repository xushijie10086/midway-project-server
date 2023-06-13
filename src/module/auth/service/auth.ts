/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-05 18:17:31
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-13 15:49:21
 * @FilePath: \midway-project-server\src\module\auth\service\auth.ts
 * @Description: 描述一下
 *
 */
import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entity/user';
import { TokenConfig } from '../../../interface/token.config';
import { RedisService } from '@midwayjs/redis';
import { LoginDTO } from '../dto/login';
import { TokenVo } from '../vo/token';
import { R } from '../../../common/base.error.util';
import * as bcrypt from 'bcryptjs';
import { uuid } from '../../../utils/uuid';
import { RefreshTokenDTO } from '../dto/refresh.token';

@Provide()
export class AuthService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  // 从配置文件获取token的配置信息
  @Config('token')
  tokenConfig: TokenConfig;

  @Inject()
  redisService: RedisService;

  async login(loginDTO: LoginDTO): Promise<TokenVo> {
    const { accountNumber } = loginDTO;

    const user = await this.userModel
      .createQueryBuilder('user')
      .where('user.username = :accountNumber', { accountNumber })
      .orWhere('user.username = :accountNumber', { accountNumber })
      .orWhere('user.email = :accountNumber', { accountNumber })
      .orWhere('user.phone = :accountNumber', { accountNumber })
      .select(['user.password', 'user.id'])
      .getOne();

    if (!user) throw R.error('账号或密码错误！');

    if (!bcrypt.compareSync(loginDTO.password, user.password))
      throw R.error('账号或密码错误！');

    const { expire, refreshExpire } = this.tokenConfig;
    const token = uuid();
    const refreshToken = uuid();

    // multi可以实现redis指令并发执行
    await this.redisService
      .multi()
      .set(`token:${token}`, JSON.stringify({ userId: user.id, refreshToken }))
      .expire(`token:${token}`, expire)
      .set(`refreshToken:${refreshToken}`, user.id)
      .expire(`refreshToken:${refreshToken}`, refreshExpire)
      .exec()

    return {
      expire,
      token,
      refreshExpire,
      refreshToken,
    } as TokenVo;
  }

  /**
   * 刷新token方法，通过全段返回的refreshToken生成新的token
   * @param refreshToken string
   * @returns
   */
  async refreshToken(refreshToken: RefreshTokenDTO): Promise<TokenVo> {
    const userId = await this.redisService.get(
      `refreshToken:${refreshToken.refreshToken}`
    );
    // 检查refreshToken是否已失效
    if (!userId) throw R.error('refreshToken已失效');

    // 没有失效生成新的token
    const { expire } = this.tokenConfig;
    const token = uuid();
    await this.redisService
      .multi()
      .set(`token:${token}`, JSON.stringify({ userId, refreshToken }))
      .expire(`token:${token}`, expire)
      .exec();

    const refreshExpire = await this.redisService.ttl(
      `refreshToken:${refreshToken.refreshToken}`
    );

    return {
      expire,
      token,
      refreshExpire,
      refreshToken: refreshToken.refreshToken,
    } as TokenVo;
  }

  async getUserById(userId: number) {
    const entity = await this.userModel
      .createQueryBuilder('t')
      // .leftJoinAndMapOne(
      //   't.avatarEntity',
      //   FileEntity,
      //   'file',
      //   'file.id = t.avatar'
      // )
      .where('t.id = :id', { id: userId })
      .getOne();

    return entity.toVO();
  }
}
