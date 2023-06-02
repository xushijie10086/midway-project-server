/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 09:35:09
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-02 09:36:13
 * @FilePath: \midway-project\src\common\common.validate.rules.ts
 * @Description: 描述一下
 * 
 */
import { RuleType } from '@midwayjs/validate';

// 手机号
export const phone = RuleType.string().pattern(
  /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
);

// 邮箱
export const email = RuleType.string().pattern(
  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
);

// 字符串
export const string = RuleType.string();
// 字符串不能为空
export const requiredString = string.required();
// 字符串最大长度
export const maxString = (length: number) => string.max(length);
// 字符最小串长度
export const minString = (length: number) => string.min(length);

// 数字
export const number = RuleType.number();
// 数字不能为空
export const requiredNumber = number.required();

// bool
export const bool = RuleType.bool();
