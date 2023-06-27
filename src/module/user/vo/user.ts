/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-05 15:10:00
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-26 09:26:56
 * @FilePath: \midway-project-server\src\module\user\vo\user.ts
 * @Description: 描述一下
 * 
 */
import { UserEntity } from '../entity/user';
import { OmitVO } from '../../../utils/vo.utils';

// eslint-disable-next-line prettier/prettier
export class UserVO extends OmitVO(UserEntity, ['password']) {
  avatarPath?: string;
}
