import type { z } from 'zod';
import type { eventsTable } from '../db/schema';
import type { userSchema } from '../schemas/event-schema';
import type { eventRequest, userEventDetails } from './event.types';

interface adminEventDetails extends userEventDetails {
  attendees: z.infer<typeof userSchema>[];
}

type insertEvents = typeof eventsTable.$inferInsert;
type updateEvents = typeof eventsTable.$inferSelect;

export type { adminEventDetails, eventRequest, insertEvents, updateEvents };
