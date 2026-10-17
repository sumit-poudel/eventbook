import { count, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { DrizzleService } from '../config/drizzle-setup';
import type {
  eventPageSchema,
  userSchema,
} from '../schemas/event-schema';
import { EventError } from '../utils/errors';
import type { userEventDetails } from './event-controller';
import { bookingsTable, eventsTable, usersTable } from './schema';

interface adminEventDetails extends userEventDetails {
  attendees: z.infer<typeof userSchema>[];
}

type eventRequest = z.infer<typeof eventPageSchema>;
type insertEvents = typeof eventsTable.$inferInsert;
type updateEvents = typeof eventsTable.$inferSelect;

class AdminController {
  private dbInstance: DrizzleService;
  public constructor() {
    this.dbInstance = DrizzleService.getInstance();
  }

  public async getEvents({
    page,
    limit,
  }: eventRequest): Promise<adminEventDetails[]> {
    try {
      return await this.dbInstance.drizzleDb.transaction(async tx => {
        const events = await tx.query.eventsTable.findMany({
          offset: (page - 1) * limit,
          limit: limit,
        });
        if (events.length === 0) {
          return [];
        }
        const bookings = await tx
          .select({
            eventId: bookingsTable.eventId,
            attendee: {
              name: usersTable.name,
              age: usersTable.age,
              email: usersTable.email,
            },
          })
          .from(bookingsTable)
          .innerJoin(usersTable, eq(bookingsTable.userId, usersTable.id))
          .where(
            inArray(
              bookingsTable.eventId,
              events.map(event => event.id),
            ),
          );
        return events.map(event => {
          const attendees = bookings
            .filter(booking => booking.eventId === event.id)
            .map(booking => booking.attendee);
          return {
            ...event,
            bookedSeats: attendees.length,
            attendees: attendees,
          };
        });
      });
    } catch (error) {
      throw error;
    }
  }

  public async addEvent(event: insertEvents): Promise<number> {
    try {
      return await this.dbInstance.drizzleDb.transaction(async tx => {
        const id = await tx
          .insert(eventsTable)
          .values(event)
          .returning({ id: eventsTable.id });

        const inserted = id[0];
        if (!inserted) {
          throw new Error('Event was not created');
        }
        return inserted.id;
      });
    } catch (error) {
      throw error;
    }
  }
  public async manageEvent(event: updateEvents): Promise<void> {
    try {
      return await this.dbInstance.drizzleDb.transaction(async tx => {
        const existing = await tx.query.eventsTable.findFirst({
          where: { id: event.id },
        });
        if (!existing) {
          throw new EventError(
            `Event ${event.id} does not exist`,
            'EVENT_NOT_FOUND',
          );
        }
        const date = new Date();
        if (existing.date < date) {
          throw new EventError(
            `Event ${event.id} has already taken place`,
            'PAST_EVENT_FAILURE',
          );
        }
        if (event.date < date) {
          throw new EventError(
            `Event ${event.id} cant be updated to a past date`,
            'PAST_EVENT_FAILURE',
          );
        }
        const [row] = await tx
          .select({
            count: count(),
          })
          .from(bookingsTable)
          .where(eq(bookingsTable.eventId, event.id));
        const bookedSeats = row?.count ?? 0;
        if (event.totalSeats < bookedSeats) {
          throw new EventError(
            `Event ${event.id} has ${bookedSeats} seats booked, so it cannot have ${event.totalSeats}`,
            'SEATS_BELOW_BOOKED',
          );
        }
        const { id, ...changes } = event;
        await tx.update(eventsTable).set(changes).where(eq(eventsTable.id, id));
      });
    } catch (error) {
      throw error;
    }
  }
}

export {
  AdminController,
  type adminEventDetails,
  type insertEvents,
  type updateEvents,
};
