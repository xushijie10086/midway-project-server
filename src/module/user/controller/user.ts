/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 10:16:39
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-26 11:21:23
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
import { RuleType, Valid } from '@midwayjs/validate';
import { R } from '../../../common/base.error.util';
import { generateRandomCode } from '../../../utils/uuid';
import { RedisService } from '@midwayjs/redis';
import { MailService } from '../../../common/mail.service';
// import { NotLogin } from '../../../decorator/not.login';

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Inject()
  redisService: RedisService;

  @Inject()
  mailService: MailService;

  @Post('/', { description: '新建' })
  // @NotLogin()
  async create(@Body(ALL) data: UserDTO) {
    return await this.userService.createUser(data);
  }

  @Put('/', { description: '编辑' })
  async edit(@Body(ALL) data: UserDTO) {
    return await this.userService.editUser(data);
  }

  @Del('/:id', { description: '删除' })
  async remove(
    @Valid(RuleType.number().required().error(R.error('id不能为空')))
    @Param('id')
    id: number
  ) {
    return await this.userService.removeUser(id);
  }

  @Get('/:id', { description: '根据id查询' })
  async getById(@Param('id') id: string) {
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

  @Post('/send/email/captcha')
  async sendEmailCaptcha(@Body() emailInfo: { email: string }) {
    if (!emailInfo) throw R.error('邮箱不能为空');

    // 随机生成4位数
    const emailCaptcha = generateRandomCode();
    // 把生成的随机数存到redis中，后面添加用户的时候需要做验证
    await this.redisService.set(
      `emailCaptcha:${emailInfo.email}`,
      emailCaptcha,
      'EX',
      60 * 30 // 30分钟
    );

    this.mailService.sendMail({
      to: emailInfo.email,
      html: `<div>
      您本次的验证码是<span style="color:#5867dd;font-weight:800;font-size:24px;">${emailCaptcha}</span>，验证码有效期为30分钟。
    </div>`,
      subject: 'midway-admin平台邮箱校验提醒',
    });
  }
}
