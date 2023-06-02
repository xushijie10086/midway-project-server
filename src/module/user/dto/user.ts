import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
import { R } from '../../../common/base.error.util';
import {
  requiredString,
  requiredNumber,
} from '../../../common/common.validate.rules';
import { UserEntity } from '../entity/user';
import { BaseDTO } from '../../../common/base.dto';

export class UserDTO extends BaseDTO<UserEntity> {
  @ApiProperty({
    description: '姓名',
  })
  @Rule(requiredString.error(R.validateError('姓名不能为空')))
  name: string;

  @ApiProperty({
    description: '年龄',
  })
  @Rule(requiredNumber.error(R.validateError('年龄不能为空')))
  age: number;

  @ApiProperty({
    description: '技能',
  })
  @Rule(RuleType.allow(null))
  skill?: string;
}
