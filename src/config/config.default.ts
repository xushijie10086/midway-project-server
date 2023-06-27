/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-01 09:15:10
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-25 18:08:04
 * @FilePath: \midway-project-server\src\config\config.default.ts
 * @Description: 描述一下
 *
 */
import { MidwayConfig } from '@midwayjs/core';
import { TokenConfig } from '../interface/token.config';
import { env } from 'process';
import * as redisStore from 'cache-manager-ioredis';
import { EverythineSubscriber } from '../typeorm-event-subscriber';
import { MailConfig, MinioConfig } from '../interface';
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
        database: 'midway', // 数据库名称
        synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: true,
        // 扫描entity文件夹
        entities: ['entity', '**/entity/*{.ts,.js}'],
        timezone: '+00:00',
        // migrations: ['**/migration/*.ts'],
        // cli: {
        //   migrationsDir: 'migration',
        // },
        subscribers: [EverythineSubscriber],
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
  minio: {
    endPoint: env.MINIO_HOST || 'localhost',
    port: env.MINIO_PORT ? Number(env.MINIO_PORT) : 9001,
    useSSL: false,
    accessKey: env.MINIO_ACCESS_KEY || 'minio',
    secretKey: env.MINIO_SECRET_KEY || 'minio@123',
    bucketName: env.MINIO_BUCKET_NAME || 'midway',
  } as MinioConfig,
  bull: {
    defaultQueueOptions: {
      redis: {
        port: 6379,
        host: env.REDIS_HOST || 'localhost',
        password: env.REDIS_PASSWORD || '',
      },
    },
  },
  mail: {
    host: env.MAIL_HOST || 'smtp.qq.com',
    port: env.MAIL_PORT ? Number(env.MAIL_PORT) : 465,
    secure: true,
    auth: {
      user: env.MAIL_USER || '6887189@qq.com',
      pass: env.MAIL_PASS || 'upnanrnejribbhbb',
    },
  } as MailConfig,
} as MidwayConfig;
