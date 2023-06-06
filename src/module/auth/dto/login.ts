/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-06 09:36:49
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-06 09:40:36
 * @FilePath: \fluxy-admin\midway-project-server\src\module\auth\dto\login.ts
 * @Description: 描述一下
 * 
 */
import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { requiredString } from '../../../common/common.validate.rules';
import { R } from '../../../common/base.error.util';

export class LoginDTO {
  @ApiProperty({ description: '登录账号' })
  @Rule(requiredString.error(R.validateError('登录账号不能为空')))
  accountNumber?: string;

  @ApiProperty({ description: '登录密码' })
  @Rule(requiredString.error(R.validateError('登录密码不能为空')))
  password?: string;

  @ApiProperty({ description: '验证码key' })
  @Rule(RuleType.string())
  captchaId: string;

  @ApiProperty({ description: '验证码' })
  @Rule(requiredString.error(R.validateError('验证码不能为空')))
  captcha: string;

  @ApiProperty({ description: '公钥' })
  @Rule(RuleType.string())
  publicKey: string;
}
