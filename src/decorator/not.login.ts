/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-12 10:30:05
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-12 10:44:30
 * @FilePath: \midway-project-server\src\decorator\not.login.ts
 * @Description: 描述一下
 * 
 */
import {
  Autoload,
  Inject,
  Singleton,
  attachClassMetadata,
  MidwayWebRouterService,
  ApplicationContext,
  IMidwayContainer,
  Init,
  listModule,
  CONTROLLER_KEY,
  getClassMetadata,
} from '@midwayjs/core';

export const NOT_LOGIN_KEY = 'decorator:not.login';
export function NotLogin(): MethodDecorator {
  return (target, key, descriptor: PropertyDescriptor) => {
    attachClassMetadata(NOT_LOGIN_KEY, { methodName: key }, target);
    return descriptor;
  };
}

@Autoload()
@Singleton()
export class NotLoginDecorator {
  @Inject()
  webRouterService: MidwayWebRouterService;

  @ApplicationContext()
  applicationContext: IMidwayContainer;

  @Init()
  async init() {
    const controllerModules = listModule(CONTROLLER_KEY);
    const whiteMethods = [];
    for (const module of controllerModules) {
      const methodNames = getClassMetadata(NOT_LOGIN_KEY, module) || [];
      const className = module.name[0].toLowerCase() + module.name.slice(1);
      whiteMethods.push(
        ...methodNames.map(method => `${className}.${method.methodName}`)
      );
    }

    const routerTables = await this.webRouterService.getFlattenRouterTable();
    const whiteRouters = routerTables.filter(router =>
      whiteMethods.includes(router.handlerName)
    );
    this.applicationContext.registerObject('notLoginRouters', whiteRouters)
  }
}
