/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-25 16:06:17
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-27 09:26:31
 * @FilePath: \midway-project-server\src\module\file\service\file.ts
 * @Description: 描述一下
 *
 */
import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '../../../common/base.service';
import { FileEntity } from '../entity/file';
import { MinioClient } from '../../../autoload/minio';
import { MinioConfig } from '../../../interface';
import { UploadFileInfo } from '@midwayjs/upload';

@Provide()
export class FileService extends BaseService<FileEntity> {
  @InjectEntityModel(FileEntity)
  fileModel: Repository<FileEntity>;

  @Inject()
  minioClient: MinioClient;

  @Config('minio')
  minioConfig: MinioConfig;

  @InjectDataSource()
  defaultDataSource: DataSource;

  getModel(): Repository<FileEntity> {
    return this.fileModel;
  }

  // 上传方法
  async upload(file: UploadFileInfo<string>) {
    // 生成文件名。因为文件名可能重复，这里手动拼了时间戳。
    const fileName = `${new Date().getTime()}_${file.filename}`;

    const data = await this.defaultDataSource.transaction(async manager => {
      const fileEntity = new FileEntity();
      fileEntity.fileName = fileName;
      fileEntity.filePath = `/file/${this.minioConfig.bucketName}/${fileName}`;
      await manager.save(FileEntity, fileEntity);
      await this.minioClient.fPutObject(
        this.minioConfig.bucketName,
        fileName,
        file.data
      );

      return fileEntity;
    });

    return data;
  }

  async setPKValue(id: string, pkValue: string, pkName: string) {
    const entity = await this.getById(id);
    if (!entity) return;
    entity.pkValue = pkValue;
    entity.pkName = pkName;
    await this.fileModel.save(entity);
    return entity;
  }

  // 清理脏数据， 清理前一天的数据
  async clearEmptyPKValueFiles() {
    const curDate = new Date();
    curDate.setDate(curDate.getDate() - 1);

    const records = await this.fileModel
      .createQueryBuilder()
      .where('createDate < :date', { data: curDate })
      .andWhere('pkValue is null')
      .getMany();

    this.defaultDataSource.transaction(async manager => {
      await manager.remove(FileEntity, records);

      await Promise.all(
        records.map(record =>
          this.minioClient.removeObject(
            this.minioConfig.bucketName,
            record.fileName
          )
        )
      );
    });
  }
}
