import { DrizzleService } from '../config/drizzle-setup';
import type { eventPageSchema } from '../schemas/event-schema';
import { z } from 'zod';
import { bookingsTable, eventsTable } from './schema';
import { and, count, eq, DrizzleQueryError } from 'drizzle-orm';
import { assertError, BookingError } from '../utils/errors';

type Events = typeof eventsTable.$inferSelect;
type insertBookings = typeof bookingsTable.$inferInsert;
type eventRequest = z.infer<typeof eventPageSchema>;
interface userEventDetails extends Events {
  bookedSeats: number;
}

class EventController {
  private dbInstance: DrizzleService;
  public constructor() {
    this.dbInstance = DrizzleService.getInstance();
  }

  public async getEvents({ page, limit }: eventRequest): Promise<Events[]> {
    try {
      const events = await this.dbInstance.drizzleDb.query.eventsTable.findMany(
        {
          offset: (page - 1) * limit,
          limit: limit,
        },
      );
      return events;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEvents(): Promise<Events[]> {
    try {
      const count =
        await this.dbInstance.drizzleDb.query.eventsTable.findMany();
      return count;
    } catch (error) {
      throw error;
    }
  }

  public async getEventById(
    eid: number,
  ): Promise<userEventDetails | undefined> {
    try {
      const events =
        await this.dbInstance.drizzleDb.query.eventsTable.findFirst({
          where: { id: eid },
        });
      if (!events) {
        return undefined;
      }
      const [row] = await this.dbInstance.drizzleDb
        .select({
          count: count(),
        })
        .from(bookingsTable)
        .where(eq(bookingsTable.eventId, eid));
      return {
        ...events,
        bookedSeats: row?.count ?? 0,
      } as userEventDetails;
    } catch (error) {
      throw error;
    }
  }

  public async bookEvent(booking: insertBookings): Promise<number> {
    try {
      return await this.dbInstance.drizzleDb.transaction(async tx => {
        const event = await tx.query.eventsTable.findFirst({
          where: { id: booking.eventId },
        });
        if (!event || event.date < new Date()) {
          throw new BookingError(
            `Event ${booking.eventId} does not exist`,
            'EVENT_NOT_FOUND',
          );
        }
        const [row] = await tx
          .select({
            count: count(),
          })
          .from(bookingsTable)
          .where(eq(bookingsTable.eventId, booking.eventId));
        if (row?.count && row.count >= event.totalSeats) {
          throw new BookingError(
            `Event ${event.id} is full: ${row.count}/${event.totalSeats} seats booked`,
            'EVENT_FULL',
          );
        }
        const id = await tx
          .insert(bookingsTable)
          .values(booking)
          .returning({ id: bookingsTable.id });

        const inserted = id[0];
        if (!inserted) {
          throw new Error('Booking was not created');
        }
        return inserted.id;
      });
    } catch (error) {
      if (
        assertError(error, DrizzleQueryError) &&
        error.cause &&
        'code' in error.cause &&
        error.cause.code === '23505'
      ) {
        throw new BookingError(
          `User ${booking.userId} has already booked event ${booking.eventId}`,
          'ALREADY_BOOKED',
        );
      }
      throw error;
    }
  }

  public async cancelBooking(booking: insertBookings): Promise<void> {
    try {
      return await this.dbInstance.drizzleDb.transaction(async tx => {
        const [existingBooking] = await tx
          .select({
            id: bookingsTable.id,
            eventDate: eventsTable.date,
          })
          .from(bookingsTable)
          .innerJoin(eventsTable, eq(bookingsTable.eventId, eventsTable.id))
          .where(
            and(
              eq(bookingsTable.eventId, booking.eventId),
              eq(bookingsTable.userId, booking.userId),
            ),
          );
        if (!existingBooking) {
          throw new BookingError(
            `Booking for user ${booking.userId} and event ${booking.eventId} does not exist`,
            'EVENT_NOT_FOUND',
          );
        }
        if (existingBooking.eventDate < new Date()) {
          throw new BookingError(
            `Event ${booking.eventId} has already taken place`,
            'PAST_EVENT_FAILURE',
          );
        }
        await tx
          .delete(bookingsTable)
          .where(eq(bookingsTable.id, existingBooking.id));
      });
    } catch (error) {
      throw error;
    }
  }
}

export {
  EventController,
  type userEventDetails,
  type insertBookings,
};
