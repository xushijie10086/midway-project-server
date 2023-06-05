/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 10:16:39
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-05 16:06:18
 * @FilePath: \midway-project\src\module\user\controller\user.ts
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
    const { data: data2} = await this.userService.getById(data.id);
    // update
    data2.email = data.email;
    data2.userName = data.userName;
    data2.phone = data.phone;
    return await this.userService.edit(data2);
  }

  @Del('/:id', { description: '删除' })
  async remove(@Param('id') id: number) {
    const { data } = await this.userService.getById(id);
    return await this.userService.remove(data);
  }

  @Get('/:id', { description: '根据id查询' })
  async getById(@Param('id') id: number) {
    return await this.userService.getById(id);
  }

  @Get('/page', { description: '分页查询' })
  async page(@Query('page') page: number, @Query('size') size: number) {
    return await this.userService.page(page, size);
  }

  @Get('/list', { description: '查询全部' })
  async list() {
    return await this.userService.list();
  }
}
