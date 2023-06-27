/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 10:09:52
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-25 16:29:08
 * @FilePath: \midway-project-server\src\common\base.dto.ts
 * @Description: 描述一下
 * 
 */
import { ApiProperty } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';

export class BaseDTO<T> {
  @ApiProperty()
  @Rule(RuleType.allow(null))
  id: string;
  toEntity(): T {
    return this as unknown as T;
  }
}