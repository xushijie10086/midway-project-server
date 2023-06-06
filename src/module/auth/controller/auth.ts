/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-05 18:17:31
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-06 15:08:17
 * @FilePath: \fluxy-admin\midway-project-server\src\module\auth\controller\auth.ts
 * @Description: 描述一下
 *
 */
import {
  Body,
  Controller,
  Get,
  Inject,
  Provide,
  ALL,
  Post,
} from '@midwayjs/decorator';
import * as NodeRSA from 'node-rsa';
import { AuthService } from '../service/auth';
import { CaptchaService } from '@midwayjs/captcha';
import { LoginDTO } from '../dto/login';
import { R } from '../../../common/base.error.util';
import { RedisService } from '@midwayjs/redis';

@Provide()
@Controller('/auth')
export class AuthController {
  @Inject()
  authService: AuthService;

  @Inject()
  captchaService: CaptchaService;

  @Inject()
  redisService: RedisService;

  @Get('/captcha', { description: '获取验证码图片' })
  async getImageCaptcha() {
    const { id, imageBase64 } = await this.captchaService.formula({
      height: 40,
      width: 120,
      noise: 1,
    });
    return { id, imageBase64 };
  }

  @Post('/login', { description: '用户登录' })
  async login(@Body(ALL) loginDTO: LoginDTO) {
    const { captcha, captchaId } = loginDTO;
    const result = await this.captchaService.check(captchaId, captcha);
    if (!result) throw R.error('验证码错误');

    const privateKey = await this.redisService.get(
      `publicKey:${loginDTO.publicKey}`
    );
    await this.redisService.del(`publicKey:${loginDTO.publicKey}`);

    if (!privateKey) throw R.error('登录出现异常，请重新登录');

    // 解密
    const decrypt = new NodeRSA(privateKey);
    decrypt.setOptions({ encryptionScheme: 'pkcs1' });
    const password = decrypt.decrypt(loginDTO.password, 'utf8');
    if (!password) throw R.error('登陆异常，请重新登录！');
    loginDTO.password = password;
    return await this.authService.login(loginDTO);
  }

  @Get('/publicKey')
  async getPublicKey() {
    const key = new NodeRSA({ b: 512 });
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    await this.redisService.set(`publicKey:${publicKey}`, privateKey);
    return publicKey;
  }
}
