export class BaseResponse<T> {
  code: number;
  msg: string;
  data: T;

  constructor(data: T, code: number, msg: string) {
    this.code = code;
    this.data = data;
    this.msg = msg;
  }

  static create<T>(data: T, code: number, msg: string) {
    return new BaseResponse(data, code, msg);
  }

  static ok<T>(data: T) {
    return BaseResponse.create(data, 0, 'OK');
  }

  static error(msg: string, code: number) {
    return BaseResponse.create(null, code, msg);
  }
}
