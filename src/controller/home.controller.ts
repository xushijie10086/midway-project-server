/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-01 09:15:10
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-05 09:18:03
 * @FilePath: \midway-project\src\controller\home.controller.ts
 * @Description: 描述一下
 *
 */
import { Controller, Get, Inject, Post, Body } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService, RedisServiceFactory } from '@midwayjs/redis';
import { MidwayI18nService } from '@midwayjs/i18n';
import { CommonError } from '../common/common.error';
import { ILogger } from '@midwayjs/logger';
import { R } from '../common/base.error.util';
import { UserEntity } from '../module/user/entity/user';
import { UserDTO } from '../module/user/dto/user';
@Controller('/')
export class HomeController {
  @InjectEntityModel(UserEntity)
  userModel: Repository<UserEntity>;

  @Inject()
  redisService: RedisService;

  @Inject()
  redisFactory: RedisServiceFactory;

  @Inject()
  i18nService: MidwayI18nService;

  @Inject()
  logger: ILogger;

  @Get('/')
  async home(): Promise<string> {
    const users = await this.userModel.find();

    // const redisClient2 = this.redisFactory.get('client2')
    // console.log(redisClient2);

    // return userList;
    await this.redisService.set('user', users.map(x => x.id).toString());
    const u = this.redisService.get('user');
    return u;
    // return await this.userModel.find();
  }

  @Get('/getUsers')
  async getUsers(): Promise<UserEntity[]> {
    return await this.userModel.find();
  }

  @Get('/getRedis')
  async getRedis(): Promise<string> {
    return await this.redisService.get('user');
  }

  @Get('/testi18n')
  async testi18n(): Promise<string> {
    return this.i18nService.translate('hello', {
      locale: 'zh_CN',
    });
  }

  @Post('/testValidate')
  async testValidate(@Body() user: UserDTO): Promise<void> {
    this.logger.info(user);
    console.log(user);
    throw new CommonError('hello');
  }

  @Post('/testCommonError')
  async testCommonError(): Promise<void> {
    throw new CommonError('hello');
  }

  @Post('/testLogger')
  async testLogger(@Body() user: UserDTO): Promise<void> {
    this.logger.info(user);
    console.log(user);
    throw R.error('hello');
  }
}
