/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-01 09:15:10
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-05 09:14:57
 * @FilePath: \midway-project\src\config\config.default.ts
 * @Description: 描述一下
 *
 */
import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1685582110735_9773',
  koa: {
    port: 7001,
    globalPrefix: '/api',
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: 'localhost', // 数据库ip地址，本地就写localhost
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'test', // 数据库名称
        synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: true,
        // 扫描entity文件夹
        entities: ['entity', '**/entity/*{.ts,.js}'],
      },
    },
  },
  redis: {
    clients: {
      default1: {
        port: 6379,
        host: 'localhost',
        password: '123456',
        db: 0,
      },
      // client2: {
      //   port: 6380,
      //   host: 'localhost',
      //   password: '123456',
      //   db: 0,
      // },
    },
    defaultClientName: 'default1',
  },
  i18n: {
    localeTable: {
      en_US: require('../locales/en_US.json'),
      zh_CN: require('../locales/zh_CN.json'),
    },
    defaultLocale: 'zh_CN',
  },
  swagger: {
    swaggerPath: 'doc',
  },
  validate: {
    validationOptions: {
      allowUnknown: true,
    },
  },
} as MidwayConfig;
