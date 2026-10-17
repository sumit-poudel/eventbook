import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { DrizzleService } from '../config/drizzle-setup';
import { usersTable } from '../db/schema';
import { signupSchema } from '../schemas/user-schema';
import { encryptedHash } from '../utils/encrypt';
import logger from '../utils/logger';

type NewUser = typeof usersTable.$inferInsert;

const parsed = signupSchema.safeParse({
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  age: 100,
});

if (!parsed.success) {
  logger.error(z.prettifyError(parsed.error));
  process.exit(1);
}

const admin: NewUser = {
  ...parsed.data,
  password: encryptedHash(parsed.data.password),
  role: 'admin',
};

const db = DrizzleService.getInstance().drizzleDb;
const existing = await db.query.usersTable.findFirst({
  where: { email: admin.email },
});

if (existing) {
  await db.update(usersTable).set(admin).where(eq(usersTable.id, existing.id));
  logger.info(`Admin ${admin.email} updated (id ${existing.id})`);
} else {
  const inserted = await db
    .insert(usersTable)
    .values(admin)
    .returning({ id: usersTable.id });
  logger.info(`Admin ${admin.email} created (id ${inserted[0]?.id})`);
}
process.exit(0);
