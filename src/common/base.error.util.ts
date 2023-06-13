/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 09:27:23
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-02 09:29:49
 * @FilePath: \midway-project\src\common\base.error.util.ts
 * @Description: 描述一下
 *
 */
import { MidwayValidationError } from '@midwayjs/validate';
import { CommonError } from './common.error';
import { httpError } from '@midwayjs/core';

export class R {
  static error(message: string) {
    return new CommonError(message);
  }

  static validateError(message: string) {
    return new MidwayValidationError(message, 422, null);
  }

  static unauthorizedError(message: string) {
    return new httpError.UnauthorizedError(message);
  }

  static forbiddenError(message: string) {
    return new httpError.ForbiddenError(message);
  }
}
