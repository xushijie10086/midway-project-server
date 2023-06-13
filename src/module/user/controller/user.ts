/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 10:16:39
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-13 11:20:52
 * @FilePath: \midway-project-server\src\module\user\controller\user.ts
 * @Description: 描述一下
 *
 */
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Provide,
  Query,
  ALL,
  Put,
  Param,
  Del,
} from '@midwayjs/decorator';
import { UserDTO } from '../dto/user';
import { UserService } from '../service/user';
import { FindOptionsWhere, Like } from 'typeorm';
import { UserEntity } from '../entity/user';

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Post('/', { description: '新建' })
  async create(@Body(ALL) data: UserDTO) {
    return await this.userService.create(data.toEntity());
  }

  @Put('/', { description: '编辑' })
  async edit(@Body(ALL) data: UserDTO) {
    const user = await this.userService.getById(data.id);
    // update
    user.email = data.email;
    user.nickName = data.nickName;
    user.phone = data.phone;
    user.userName = data.userName;
    user.avatar = data.avatar;
    user.sex = data.sex;
    return await this.userService.edit(user);
  }

  @Del('/:id', { description: '删除' })
  async remove(@Param('id') id: number) {
    const user = await this.userService.getById(id);
    return await this.userService.remove(user);
  }

  @Get('/:id', { description: '根据id查询' })
  async getById(@Param('id') id: number) {
    return await this.userService.getById(id);
  }

  @Get('/page', { description: '分页查询' })
  async page(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('nickName') nickName: string,
    @Query('userName') userName: string,
    @Query('phone') phone: string
  ) {
    const query: FindOptionsWhere<UserEntity> = {};

    if (phone) query.phone = Like(`%${phone}%`);
    if (nickName) query.nickName = Like(`%${nickName}%`);
    if (userName) query.userName = Like(`%${userName}%`);

    return await this.userService.page(page, size, query);
  }

  @Get('/list', { description: '查询全部' })
  async list() {
    return await this.userService.list();
  }
}
