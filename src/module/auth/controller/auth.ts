/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-05 18:17:31
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-26 15:19:48
 * @FilePath: \midway-project-server\src\module\auth\controller\auth.ts
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
import { LoginDTO } from '../dto/login';
import { R } from '../../../common/base.error.util';
import { RedisService } from '@midwayjs/redis';
import { RefreshTokenDTO } from '../dto/refresh.token';
import { UserVO } from '../../user/vo/user';
import { UserService } from '../../user/service/user';
import { Context } from '@midwayjs/core';
import { NotLogin } from '../../../decorator/not.login';
import { CaptchaService } from '../service/captcha';
import { uuid } from '../../../utils/uuid';
import { MailService } from '../../../common/mail.service';
import { ResetPasswordDTO } from '../dto/reset.password';

@Provide()
@Controller('/auth')
export class AuthController {
  @Inject()
  authService: AuthService;

  @Inject()
  captchaService: CaptchaService;

  @Inject()
  redisService: RedisService;

  @Inject()
  userService: UserService;

  @Inject()
  mailService: MailService;

  @Inject()
  ctx: Context;

  @Get('/captcha', { description: '获取验证码图片' })
  @NotLogin()
  async getImageCaptcha() {
    const { id, imageBase64 } = await this.captchaService.formula({
      height: 40,
      width: 120,
      noise: 1,
      color: true,
    });
    return { id, imageBase64 };
  }

  @Post('/login', { description: '用户登录' })
  @NotLogin()
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
  @NotLogin()
  async getPublicKey() {
    const key = new NodeRSA({ b: 512 });
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    await this.redisService.set(`publicKey:${publicKey}`, privateKey);
    return publicKey;
  }

  @Post('/refresh/token', { description: '刷新token' })
  @NotLogin()
  async refreshToken(@Body(ALL) data: RefreshTokenDTO) {
    if (!data.refreshToken) {
      throw R.error('用户凭证已过期，请重新登录！');
    }
    return this.authService.refreshToken(data);
  }

  @Get('/current/user')
  async getCurrentUser(): Promise<UserVO> {
    const user = await this.authService.getUserById(this.ctx.userInfo.userId);
    return user as UserVO;
  }

  @Post('/logout')
  async logout(): Promise<boolean> {
    // 清除token和refreshToken
    const res = await this.redisService
      .multi()
      .del(`token:${this.ctx.token}`)
      .del(`refreshToken:${this.ctx.userInfo.refreshToken}`)
      .exec();
    if (res.some(x => x[0])) {
      throw R.error('退出登录失败');
    }

    return true;
  }

  @NotLogin()
  @Post('/send/reset/password/email')
  async sendResetPasswordEmail(@Body() emailInfo: { email: string }) {
    if (!emailInfo.email) throw R.error('邮箱不能为空');

    if (!(await this.userService.getByEmail(emailInfo.email)))
      throw R.error('系统中不存在当前邮箱');

    const emailCaptcha = uuid();

    await this.redisService.set(
      `resetPasswordEmailCaptcha:${emailInfo.email}`,
      emailCaptcha,
      'EX',
      60 * 60
    );

    const resetPasswordUrl = `http://127.0.0.1:5173/user/reset-password?email=${emailInfo.email}&emailCaptcha=${emailCaptcha}`;
    this.mailService.sendMail({
      to: emailInfo.email,
      html: `<div style="padding: 28px 0; color: #888;">
      <h1 style="color: #888;">
        <span style="color:#5867dd; margin:0 1px;"><a>${emailInfo.email}</a></span>， 你好！
      </h1>
      <p>请先确认本邮件是否是你需要的。</p>
      <p>请点击下面的地址，根据提示进行密码重置：</p>
      <a href="${resetPasswordUrl}" target="_blank" style="text-decoration: none;
      display: inline-block;
      padding: 8px 25px;
      background: #5867dd;
      cursor: pointer;
      color: #fff;
      border-radius: 5px;" rel="noopener">点击跳转到密码重置页面</a>
      <p>如果单击上面按钮没有反应，请复制下面链接到浏览器窗口中，或直接输入链接。</p>
      <p>
        ${resetPasswordUrl}
      </p>
      <p>如您未提交该申请，请不要理会此邮件，对此为您带来的不便深表歉意。</p>
      <p>本次链接30分钟后失效。</p>
      <div style="text-align: right;margin-top: 50px;">
        <span>fluxy-admin</span>
      </div>
    </div>`,
      subject: 'midway-admin平台密码重置提醒',
    });
  }

  @Post('/reset/password')
  @NotLogin()
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    await this.authService.resetPassword(resetPasswordDTO)
  }
}
