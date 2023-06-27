/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-26 10:33:19
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-26 11:22:31
 * @FilePath: \midway-project-server\src\common\mail.service.ts
 * @Description: 描述一下
 * 
 */
import { Config, Provide, Singleton } from '@midwayjs/core';
import { MailConfig } from '../interface';
import * as nodemailer from 'nodemailer';

interface MailInfo {
  // 目标邮箱
  to: string;
  // 标题
  subject: string;
  // 文本
  text?: string;
  // 富文本，如果文本和富文本同时设置，富文本生效。
  html?: string;
}

@Provide()
@Singleton()
export class MailService {
  @Config('mail')
  mailConfig: MailConfig;

  async sendMail(mailInfo: MailInfo) {
    const transporter = nodemailer.createTransport(this.mailConfig);

    // 定义transporter对象并发送邮件
    const info = await transporter.sendMail({
      from: this.mailConfig.auth.user,
      ...mailInfo,
    });

    return info;
  }
}
