/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-26 08:54:10
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-27 09:26:02
 * @FilePath: \midway-project-server\src\queue\clear.file.ts
 * @Description: 描述一下
 * 
 */
// src/queue/clear.file.ts
import { Processor, IProcessor } from '@midwayjs/bull';
import { Inject } from '@midwayjs/core';
import { FileService } from '../module/file/service/file';

// 每天凌晨00:00:00定时执行下面清理文件的方法
@Processor('clear_file', {
  repeat: {
    cron: '0 0 0 * * *',
  },
})
export class ClearFileProcessor implements IProcessor {
  @Inject()
  fileService: FileService;

  async execute() {
    // 调用文件服务里清理文件方法
    this.fileService.clearEmptyPKValueFiles();
  }
}