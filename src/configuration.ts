/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-01 09:15:10
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-13 09:56:23
 * @FilePath: \midway-project-server\src\configuration.ts
 * @Description: 描述一下
 *
 */
import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import * as orm from '@midwayjs/typeorm';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as i18n from '@midwayjs/i18n';
import * as cache from '@midwayjs/cache';
import { ValidateErrorFilter } from './filter/validate.filter';
import { CommonErrorFilter } from './filter/common.filter';
import { AuthMiddleWare } from './middleware/auth.middleware';
@Configuration({
  imports: [
    koa,
    validate,
    orm,
    redis,
    i18n,
    cache,
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, AuthMiddleWare]);
    // add filter
    this.app.useFilter([
      ValidateErrorFilter,
      CommonErrorFilter,
      NotFoundFilter,
    ]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
