/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-06 10:02:36
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-06 10:03:11
 * @FilePath: \fluxy-admin\midway-project-server\src\utils\uuid.ts
 * @Description: 描述一下
 *
 */
import { nanoid } from 'nanoid';

export const uuid = () => {
  return nanoid();
};

export const generateRandomCode = () => {
  return Math.floor(Math.random() * 9000) + 1000;
};
