import { Rule } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
import { R } from '../../../common/base.error.util';
import { requiredString } from '../../../common/common.validate.rules';
import { AuthEntity } from '../entity/auth';
import { BaseDTO } from '../../../common/base.dto';

export class AuthDTO extends BaseDTO<AuthEntity> {
  @ApiProperty({
    description: '代码',
  })
  @Rule(requiredString.error(R.validateError('代码不能为空')))
  code?: string;
  @ApiProperty({
    description: '名称',
  })
  @Rule(requiredString.error(R.validateError('名称不能为空')))
  name?: string;
}