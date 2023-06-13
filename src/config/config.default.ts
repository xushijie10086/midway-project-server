/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-01 09:15:10
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-13 14:29:32
 * @FilePath: \midway-project-server\src\config\config.default.ts
 * @Description: 描述一下
 *
 */
import { MidwayConfig } from '@midwayjs/core';
import { TokenConfig } from '../interface/token.config';
import { env } from 'process';
import * as redisStore from 'cache-manager-ioredis';
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
    client: {
      port: 6379, // Redis port
      host: env.REDIS_HOST || 'localhost', // Redis host
      password: env.REDIS_PASSWORD || '',
      db: 0,
    },
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
  token: {
    expire: 60 * 60 * 2, // 2小时
    refreshExpire: 60 * 60 * 24 * 15, // 15天
  } as TokenConfig,
  cache: {
    store: redisStore,
    options: {
      host: 'localhost', // default value
      port: 6379, // default value
       password: env.REDIS_PASSWORD || '',
      db: 0,
      keyPrefix: 'cache:',
      ttl: 100,
    },
  },
  captcha: {
    default: {
      size: 4,
      noise: 1,
      width: 120,
      height: 40,
    },
    image: {
      type: 'mixed',
    },
    formula: {},
    text: {},
    expirationTime: 3600,
    idPrefix: 'captcha',
  },
} as MidwayConfig;
