import { DrizzleService } from '../config/drizzle-setup';
import type { eventPageSchema } from '../schemas/event-schema';
import { z } from 'zod';
import { bookingsTable, type eventsTable } from './schema';
import type { User } from './user-controller';
import { count, eq } from 'drizzle-orm';

type Events = typeof eventsTable.$inferSelect;
type eventRequest = z.infer<typeof eventPageSchema>;
interface userEventDetails extends Events {
  bookedSeats: number;
}

interface adminEventDetails extends userEventDetails {
  attendees: User[];
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
  public async getEventById(id: number): Promise<userEventDetails | undefined> {
    try {
      const events =
        await this.dbInstance.drizzleDb.query.eventsTable.findFirst({
          where: { id: id },
        });
      const [row] = await this.dbInstance.drizzleDb
        .select({
          count: count(),
        })
        .from(bookingsTable)
        .where(eq(bookingsTable.eventId, id));
      return {
        ...events,
        bookedSeats: row?.count ?? 0,
      } as userEventDetails;
    } catch (error) {
      throw error;
    }
  }
}

export {
  EventController,
  type userEventDetails,
  type adminEventDetails,
};
