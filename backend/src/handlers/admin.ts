import { AdminController } from '../db/admin-controller';
import {
  eventPageSchema,
  eventSchema,
  updateEventSchema,
} from '../schemas/event-schema';
import {
  assertError,
  ClientError,
  EventError,
  type EventErrorCode,
  ServerError,
} from '../utils/errors';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import type { Request, Response } from 'express';
import logger from '../utils/logger';

const eventErrorResponse = (
  code: EventErrorCode,
): { statusCode: StatusCodes; message: string } => {
  switch (code) {
    case 'EVENT_NOT_FOUND':
      return {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Event not found',
      };
    case 'PAST_EVENT_FAILURE':
      return {
        statusCode: StatusCodes.CONFLICT,
        message: 'This event has already taken place',
      };
    case 'SEATS_BELOW_BOOKED':
      return {
        statusCode: StatusCodes.CONFLICT,
        message: 'Seats cannot be fewer than the seats already booked',
      };
  }
};

const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    if (userId === null) {
      const clientError = new ClientError(
        StatusCodes.UNAUTHORIZED,
        getReasonPhrase(StatusCodes.UNAUTHORIZED),
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const parsedEventPage = eventPageSchema.safeParse({ page, limit });
    if (!parsedEventPage.success) {
      const clientError = new ClientError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        parsedEventPage.error.message,
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const adminController = new AdminController();
    const events = await adminController.getEvents(parsedEventPage.data);
    res.status(StatusCodes.OK).json(events);
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

const addEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    if (userId === null) {
      const clientError = new ClientError(
        StatusCodes.UNAUTHORIZED,
        getReasonPhrase(StatusCodes.UNAUTHORIZED),
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const parsedEvent = eventSchema.safeParse(req.body);
    if (!parsedEvent.success) {
      const clientError = new ClientError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        parsedEvent.error.message,
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const adminController = new AdminController();
    const id = await adminController.addEvent(parsedEvent.data);
    res.status(StatusCodes.CREATED).json({
      message: 'Event added successfully',
      id: id,
    });
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

const manageEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    if (userId === null) {
      const clientError = new ClientError(
        StatusCodes.UNAUTHORIZED,
        getReasonPhrase(StatusCodes.UNAUTHORIZED),
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const eventId = req.params.id;
    if (!eventId) {
      const clientError = new ClientError(
        StatusCodes.BAD_REQUEST,
        'Event ID is required',
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const parsedEvent = updateEventSchema.safeParse({
      ...req.body,
      id: eventId,
    });
    if (!parsedEvent.success) {
      const clientError = new ClientError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        parsedEvent.error.message,
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const adminController = new AdminController();
    await adminController.manageEvent(parsedEvent.data);
    res.status(StatusCodes.OK).json({ message: 'Event updated successfully' });
  } catch (error: Error | unknown) {
    if (assertError(error, Error)) {
      if (assertError(error, EventError)) {
        logger.warn(error.message);
        const { statusCode, message } = eventErrorResponse(error.code);
        const clientError = new ClientError(statusCode, message);
        clientError.sendErrorResponse(res);
        return;
      }
      const serverError = new ServerError(error.message);
      serverError.sendErrorResponse(res);
      return;
    }
    const serverError = new ServerError('Internal Server Error');
    serverError.sendErrorResponse(res);
    return;
  }
};

export { getEvents, addEvent, manageEvent };
