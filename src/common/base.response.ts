export class BaseResponse<T> {
  code: number;
  message: string;
  data: T;

  constructor(data: T, code: number, message: string) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static create<T>(data: T, code: number, message: string) {
    return new BaseResponse(data, code, message);
  }

  static ok<T>(data: T) {
    return BaseResponse.create(data, 0, 'OK');
  }

  static error(message: string, code: number) {
    return BaseResponse.create(null, code, message);
  }
}
