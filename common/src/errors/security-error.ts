import { CustomError } from './custom-error';

export class SecurityError extends CustomError {
  statusCode = 412;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, SecurityError.prototype);
  }

  serializeErrors() {
    return [{ status: this.statusCode, message: this.message, data: { response: 'Security Error' } }];
  }
}
