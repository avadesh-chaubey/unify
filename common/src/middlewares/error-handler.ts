import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send(err.serializeErrors());
  }

  console.log(err);
  res.status(400).send([{ status: 400, message: 'Something went wrong', data: { response: 'Something went wrong' } }]);
};
