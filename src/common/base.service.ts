/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 09:14:03
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-05 16:12:01
 * @FilePath: \midway-project\src\common\base.service.ts
 * @Description: 描述一下
 *
 */
import { Context } from '@midwayjs/koa';
import { BaseEntity } from './base.entity';
import { Inject } from '@midwayjs/decorator';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseResponse } from './base.response';

export abstract class BaseService<T extends BaseEntity> {
  @Inject()
  ctx: Context;

  abstract getModel(): Repository<T>;

  async create(entity: T): Promise<any> {
    const data = await this.getModel().save(entity);
    return BaseResponse.ok(data);
  }

  async edit(entity: T): Promise<any> {
    const data = await this.getModel().save(entity);
    return BaseResponse.ok(data);
  }

  async remove(entity: T) {
    const data = await this.getModel().remove(entity);
    return BaseResponse.ok(data);
  }

  async getById(id: number) {
    const data = await this.getModel()
      .createQueryBuilder('model')
      .where('model.id = :id', { id })
      .getOne();
    return BaseResponse.ok(data);
  }

  async page(page: number = 0, pageSize: number = 10, where?: FindOptionsWhere<T>) {
    const order: any = { createDate: 'desc' };
    const [data, total] = await this.getModel().findAndCount({
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });

    return BaseResponse.ok({ list: data, total, page, pageSize });
  }

  async list(where?: FindOptionsWhere<T>) {
    const order: any = { createDate: 'desc' };
    const data = await this.getModel().find({
      where,
      order,
    });
    return BaseResponse.ok(data);
  }
}
