import { StatusCodes } from 'http-status-codes';
import { BookingStatus } from '../types/event.types';
import type { BookingErrorCode, EventErrorCode } from './errors';

const bookingStatus = (
  bookedSeats: number,
  totalSeats: number,
): BookingStatus => {
  if (bookedSeats >= totalSeats) {
    return BookingStatus.houseful;
  }
  if (bookedSeats > 0) {
    return BookingStatus.booked;
  }
  return BookingStatus.unbooked;
};

const bookingErrorResponse = (
  code: BookingErrorCode,
): { statusCode: StatusCodes; message: string } => {
  switch (code) {
    case 'EVENT_NOT_FOUND':
      return {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Event not found',
      };
    case 'EVENT_FULL':
      return {
        statusCode: StatusCodes.CONFLICT,
        message: 'This event is fully booked',
      };
    case 'ALREADY_BOOKED':
      return {
        statusCode: StatusCodes.CONFLICT,
        message: 'You have already booked this event',
      };
    case 'PAST_EVENT_FAILURE':
      return {
        statusCode: StatusCodes.CONFLICT,
        message: 'This event has already taken place',
      };
  }
};

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

export { bookingStatus, bookingErrorResponse, eventErrorResponse };
