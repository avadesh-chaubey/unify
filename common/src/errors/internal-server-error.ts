import { CustomError } from './custom-error';

export class InternalServerError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to server';

  constructor() {
    super('Error connecting to server');

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    return [{ status: this.statusCode, message: this.message, data: { response: 'Internal Server Error' } }];
  }
}
