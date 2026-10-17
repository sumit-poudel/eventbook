import type { Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import logger from './logger';

class UserAlreadyExistsError extends Error {
  public override readonly name = 'UserAlreadyExistsError';
  constructor(message = 'User already exists') {
    super(message);
  }
}

type BookingErrorCode =
  | 'EVENT_NOT_FOUND'
  | 'EVENT_FULL'
  | 'ALREADY_BOOKED'
  | 'PAST_EVENT_FAILURE';

class BookingError extends Error {
  public override readonly name = 'BookingError';
  public readonly code: BookingErrorCode;
  constructor(message: string, code: BookingErrorCode) {
    super(message);
    this.code = code;
  }
}

type EventErrorCode =
  | 'EVENT_NOT_FOUND'
  | 'PAST_EVENT_FAILURE'
  | 'SEATS_BELOW_BOOKED';

class EventError extends Error {
  public override readonly name = 'EventError';
  public readonly code: EventErrorCode;
  constructor(message: string, code: EventErrorCode) {
    super(message);
    this.code = code;
  }
}

const assertError = function <T extends Error>(
  err: unknown,
  errConstructor: new (...args: never[]) => T,
): err is T {
  return err instanceof errConstructor;
};

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
export {
  UserAlreadyExistsError,
  BookingError,
  type BookingErrorCode,
  EventError,
  type EventErrorCode,
  assertError,
  ClientError,
  ServerError,
};
