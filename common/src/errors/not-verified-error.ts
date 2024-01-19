import { CustomError } from './custom-error';

export class NotVerifiedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Verified');

    Object.setPrototypeOf(this, NotVerifiedError.prototype);
  }

  serializeErrors() {
    return [{ status: this.statusCode, message: this.message, data: { response: 'User Not Verified Error' } }];
  }
}
