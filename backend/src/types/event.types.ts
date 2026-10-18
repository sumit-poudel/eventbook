import type { z } from 'zod';
import type { bookingsTable, eventsTable } from '../db/schema';
import type { eventPageSchema } from '../schemas/event-schema';

type Events = typeof eventsTable.$inferSelect;
type insertBookings = typeof bookingsTable.$inferInsert;
type eventRequest = z.infer<typeof eventPageSchema>;

enum BookingStatus {
  unbooked = 'unbooked',
  booked = 'booked',
  houseful = 'houseful',
}

interface userEventDetails extends Events {
  bookedSeats: number;
  status: BookingStatus;
}

interface userBookingDetails extends Events {
  bookingId: number;
}

export type {
  Events,
  insertBookings,
  eventRequest,
  userEventDetails,
  userBookingDetails,
};
export { BookingStatus };
