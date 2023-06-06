/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-05 18:17:31
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-06 14:58:49
 * @FilePath: \fluxy-admin\midway-project-server\src\module\auth\service\auth.ts
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

@Provide()
export class AuthService {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

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
      .set(`token:${token}`, user.id)
      .expire(`token:${token}`, expire)
      .set(`refreshToken:${refreshToken}`, user.id)
      .expire(`refreshToken:${refreshToken}`, refreshExpire);

    return { expire, token, refreshExpire, refreshToken } as TokenVo;
  }
}
