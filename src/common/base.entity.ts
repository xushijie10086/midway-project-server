/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 09:10:30
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-05 15:34:24
 * @FilePath: \midway-project\src\common\base.entity.ts
 * @Description: 封装基础实体类
 *
 */
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id?: number;

  @CreateDateColumn({ comment: '创建日期' })
  createDate?: Date;

  @UpdateDateColumn({ comment: '更新日期' })
  updateDate?: Date;
  toVO(): any {
    return this;
  }
}
