/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-05 15:10:00
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-25 18:03:49
 * @FilePath: \midway-project-server\src\module\user\entity\user.ts
 * @Description: 描述一下
 *
 */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { UserVO } from '../vo/user';
import { omit } from 'lodash';
import { FileEntity } from '../../file/entity/file';

@Entity('sys_user')
export class UserEntity extends BaseEntity {
  @Column({ comment: '用户名称' })
  userName: string;

  @Column({ comment: '用户昵称' })
  nickName: string;

  @Column({ comment: '手机号' })
  phone: string;

  @Column({ comment: '邮箱' })
  email: string;

  @Column({ comment: '头像', nullable: true })
  avatar?: string;

  @Column({ comment: '性别（0:女，1:男）', nullable: true })
  sex?: number;

  @Column({ comment: '密码' })
  password: string;

  toVO(): UserVO {
    const userVo = omit<UserEntity>(this, ['password', 'avatar']) as UserVO;
    userVo.avatarPath = this.avatarEntity?.filePath;
    return userVo;
  }
  avatarEntity?: FileEntity;
}
