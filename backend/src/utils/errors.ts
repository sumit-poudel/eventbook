import type { Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import logger from './logger';

class UserAlreadyExistsError extends Error {
  constructor() {
    super('User already exists');
  }
}
class ClientError {
  private statuscode: StatusCodes;
  private message: string;
  constructor(statuscode: StatusCodes, message: string) {
    this.statuscode = statuscode;
    this.message = message;
  }

  public sendErrorResponse(res: Response): void {
    res.status(this.statuscode).json({ error: this.message });
  }
}

class ServerError {
  private message: string;

  constructor(message: string) {
    this.message = message;
    logger.error(message);
  }
  public sendErrorResponse(res: Response): void {
    const clientErr = new ClientError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    );
    clientErr.sendErrorResponse(res);
  }
}
export { UserAlreadyExistsError, ClientError,ServerError };
