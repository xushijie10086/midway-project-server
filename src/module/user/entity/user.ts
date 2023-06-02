/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 10:16:39
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-02 10:29:19
 * @FilePath: \midway-project\src\module\user\entity\user.ts
 * @Description: 描述一下
 * 
 */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ comment: '姓名' })
  name: string;
  @Column({ comment: '年龄' })
  age: number;
  @Column({ comment: '技能' })
  skill?: string;
  // toVO(): UserVO {
  //   return omit<UserEntity>(this, ['password']) as UserVO;
  // }
}
