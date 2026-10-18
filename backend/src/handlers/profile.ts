import type { Request, Response } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { EventController } from '../db/event-controller';
import { assertError, ClientError, ServerError } from '../utils/errors';

const whoami = async (req: Request, res: Response): Promise<void> => {
  if (!req.user.isAuthenticated || req.user.role == null) {
    res.status(StatusCodes.OK).json({ user: 'GUEST' });
    return;
  }
  switch (req.user.role) {
    case 'user':
      res.status(StatusCodes.OK).json({ user: 'USER' });
      break;
    case 'admin':
      res.status(StatusCodes.OK).json({ user: 'ADMIN' });
      break;
    default:
      res.status(StatusCodes.OK).json({ user: 'GUEST' });
  }
};

const bookings = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;
  if (userId === null) {
    const clientError = new ClientError(
      StatusCodes.UNAUTHORIZED,
      getReasonPhrase(StatusCodes.UNAUTHORIZED),
    );
    clientError.sendErrorResponse(res);
    return;
  }
  try {
    const eventController = new EventController();
    const userBookings = await eventController.getBookingsByUser(userId);
    res.status(StatusCodes.OK).json(userBookings);
  } catch (error: Error | unknown) {
    if (assertError(error, Error)) {
      const serverError = new ServerError(error.message);
      serverError.sendErrorResponse(res);
      return;
    }
    const serverError = new ServerError('Internal Server Error');
    serverError.sendErrorResponse(res);
    return;
  }
};

export { whoami, bookings };
