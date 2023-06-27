/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-25 16:06:17
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-25 16:23:44
 * @FilePath: \midway-project-server\src\module\file\controller\file.ts
 * @Description: 描述一下
 *
 */
import { Controller, Inject, Post, Provide, Files } from '@midwayjs/decorator';
import { FileService } from '../service/file';
import { ApiBody } from '@midwayjs/swagger';
import { NotLogin } from '../../../decorator/not.login';

@Provide()
@Controller('/file')
export class FileController {
  @Inject()
  fileService: FileService;

  @Post('/upload', { description: '新建' })
  @ApiBody({ description: 'file' })
  @NotLogin()
  async create(@Files() files) {
    if (files.length) {
      return await this.fileService.upload(files[0]);
    }

    return {};
  }
}
