import { EventController } from '../db/event-controller';
import {
  bookingSchema,
  eventIdSchema,
  eventPageSchema,
} from '../schemas/event-schema';
import {
  assertError,
  BookingError,
  ClientError,
  ServerError,
} from '../utils/errors';
import { bookingErrorResponse } from '../utils/eventutils';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import type { Request, Response } from 'express';
import logger from '../utils/logger';

const getAllEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = req.query.page;
    const limit = req.query.limit || 5;
    const eventController = new EventController();

    if (!page) {
      const events = await eventController.getAllEvents();
      res.status(StatusCodes.OK).send(events);
      return;
    }

    const parsedEventPage = eventPageSchema.safeParse({ page, limit });
    if (!parsedEventPage.success) {
      const clientError = new ClientError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        parsedEventPage.error.message,
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const events = await eventController.getEvents(parsedEventPage.data);
    res.status(StatusCodes.OK).send(events);
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

const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.id;
    if (!eventId) {
      const clientError = new ClientError(
        StatusCodes.BAD_REQUEST,
        'Event ID is required',
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const parsedEventId = eventIdSchema.safeParse(eventId);
    if (!parsedEventId.success) {
      const clientError = new ClientError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        parsedEventId.error.message,
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const eventController = new EventController();
    const event = await eventController.getEventById(parsedEventId.data);
    if (!event) {
      const clientError = new ClientError(
        StatusCodes.NOT_FOUND,
        'Event not found',
      );
      clientError.sendErrorResponse(res);
      return;
    }
    res.status(StatusCodes.OK).json(event);
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

const bookEvent = async (req: Request, res: Response): Promise<void> => {
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
    const parsedBooking = bookingSchema.safeParse({
      eventId: req.body.eventId,
    });
    if (!parsedBooking.success) {
      const clientError = new ClientError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        parsedBooking.error.message,
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const eventController = new EventController();
    const id = await eventController.bookEvent({
      userId,
      eventId: parsedBooking.data.eventId,
    });
    res.status(StatusCodes.CREATED).json({
      message: 'Event booked successfully',
      id: id,
    });
  } catch (error: Error | unknown) {
    if (assertError(error, Error)) {
      if (assertError(error, BookingError)) {
        logger.warn(error.message);
        const { statusCode, message } = bookingErrorResponse(error.code);
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

const cancelBooking = async (req: Request, res: Response): Promise<void> => {
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
    const parsedBooking = bookingSchema.safeParse({
      eventId: req.body.eventId,
    });
    if (!parsedBooking.success) {
      const clientError = new ClientError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        parsedBooking.error.message,
      );
      clientError.sendErrorResponse(res);
      return;
    }
    const eventController = new EventController();
    await eventController.cancelBooking({
      userId,
      eventId: parsedBooking.data.eventId,
    });
    res.status(StatusCodes.OK).json({
      message: 'Booking cancelled successfully',
    });
  } catch (error: Error | unknown) {
    if (assertError(error, Error)) {
      if (assertError(error, BookingError)) {
        logger.warn(error.message);
        const { statusCode, message } = bookingErrorResponse(error.code);
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

export { getAllEvent, getEventById, bookEvent, cancelBooking };
