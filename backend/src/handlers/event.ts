import { EventController, type userEventDetails } from '../db/event-controller';
import { eventIdSchema, eventPageSchema } from '../schemas/event-schema';
import { assertError, ClientError, ServerError } from '../utils/errors';
import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';

const getAllEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

const getEventById = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

export { getAllEvent, getEventById };
