/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 09:10:30
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-02 09:12:05
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
  @PrimaryGeneratedColumn()
  id?: string;

  @CreateDateColumn({ comment: '创建日期' })
  create_time?: Date;

  @UpdateDateColumn({ comment: '更新日期' })
  update_time?: Date;
}
