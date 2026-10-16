import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  unique,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'admin']);
export type Role = (typeof roleEnum.enumValues)[number];

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(), // hashed
  role: roleEnum('role').notNull().default('user'),
});

export const eventsTable = pgTable('events', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  date: timestamp().notNull(), // date + time
  venue: varchar({ length: 255 }).notNull(),
  totalSeats: integer().notNull(),
});

export const bookingsTable = pgTable(
  'bookings',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    eventId: integer()
      .notNull()
      .references(() => eventsTable.id, { onDelete: 'cascade' }),
  },
  t => ({
    uniqueBooking: unique('unique_booking').on(t.userId, t.eventId),
  }),
);
