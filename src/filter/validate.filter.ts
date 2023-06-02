/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-01 16:05:49
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-01 16:17:53
 * @FilePath: \midway-project\src\filter\validate.filter.ts
 * @Description: 描述一下
 * 
 */
import { MidwayI18nService } from '@midwayjs/i18n';
import { Context } from '@midwayjs/koa';
import { MidwayValidationError } from '@midwayjs/validate';
import { Catch } from '@midwayjs/decorator';
@Catch(MidwayValidationError)
export class ValidateErrorFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    // 获取国际化服务
    const i18nService = await ctx.requestContext.getAsync(MidwayI18nService);
    // 翻译
    const message = i18nService.translate(err.message) || err.message;
    ctx.state = 422;
    return {
      code: 422,
      message,
    };
  }
}
