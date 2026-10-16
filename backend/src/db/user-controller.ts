import { DrizzleError, DrizzleQueryError, eq } from 'drizzle-orm';
import { DrizzleService } from '../config/drizzle-setup';
import { usersTable } from './schema';
import { UserAlreadyExistsError } from '../utils/errors';

type NewUser = typeof usersTable.$inferInsert;
type User = typeof usersTable.$inferSelect;

export class UserController {
  private newUser: NewUser;
  private user: User | undefined;

  constructor(name: string, age: number, email: string, password: string) {
    this.newUser = { name, age, email, password };
  }

  public async signup() {
    try {
      const id = await DrizzleService.getInstance()
        .drizzleDb.insert(usersTable)
        .values(this.newUser)
        .returning({ id: usersTable.id });
      return id;
    } catch (error) {
      if (
        error instanceof DrizzleQueryError &&
        error.cause &&
        'code' in error.cause &&
        error.cause.code === '23505'
      ) {
        throw new UserAlreadyExistsError();
      }
      throw error;
    }
  }

  public async queryUser(email: string): Promise<User | undefined> {
    const rows = await DrizzleService.getInstance()
      .drizzleDb.select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (rows.length === 0) {
      return undefined;
    }
    return rows[0];
  }
}
