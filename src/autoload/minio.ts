/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-25 15:52:24
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-25 16:00:49
 * @FilePath: \midway-project-server\src\autoload\minio.ts
 * @Description: 描述一下
 *
 */
import {
  ApplicationContext,
  Autoload,
  Config,
  IMidwayContainer,
  Init,
  Singleton,
} from '@midwayjs/core';
import * as Minio from 'minio';

import { MinioConfig } from '../interface';

export type MinioClient = Minio.Client;

@Autoload()
@Singleton()
export class MinioAutoLoad {
  @ApplicationContext()
  applicationContext: IMidwayContainer;

  @Config('minio')
  minioConfig: MinioConfig;

  @Init()
  async init() {
    const minioClient = new Minio.Client(this.minioConfig);
    this.applicationContext.registerObject('minioClient', minioClient);
  }
}
