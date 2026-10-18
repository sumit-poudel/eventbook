import type { usersTable } from '../db/schema';

type NewUser = typeof usersTable.$inferInsert;
type User = typeof usersTable.$inferSelect;

export type { NewUser, User };
