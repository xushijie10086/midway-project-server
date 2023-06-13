/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-05 18:17:31
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-12 09:39:14
 * @FilePath: \midway-project-server\src\module\auth\controller\auth.ts
 * @Description: 描述一下
 * 
 */
import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';

export class RefreshTokenDTO {
  @ApiProperty({ description: '刷新token' })
  @Rule(RuleType.allow(null))
  refreshToken?: string;
}
