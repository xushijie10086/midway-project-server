import { ApiProperty } from '@midwayjs/swagger';

// eslint-disable-next-line prettier/prettier
export class TokenVo {
  @ApiProperty({ description: 'token的过期时间' })
  expire: number;

  @ApiProperty({ description: 'token' })
  token: string;

  @ApiProperty({ description: '刷新token的过期时间' })
  refreshExpire: number;
  
  @ApiProperty({ description: '刷新token' })
  refreshToken: string;
}
