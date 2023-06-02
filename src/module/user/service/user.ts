/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 10:16:39
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-02 14:09:50
 * @FilePath: \midway-project\src\module\user\service\user.ts
 * @Description: 描述一下
 * 
 */
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { UserEntity } from '../entity/user';

@Provide()
export class UserService extends BaseService<UserEntity> {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  getModel(): Repository<UserEntity> {
    return this.userModel;
  }
}