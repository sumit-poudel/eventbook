import { DrizzleQueryError, eq } from 'drizzle-orm';
import { DrizzleService } from '../config/drizzle-setup';
import { usersTable } from './schema';
import { assertError, UserAlreadyExistsError } from '../utils/errors';

type NewUser = typeof usersTable.$inferInsert;
type User = typeof usersTable.$inferSelect;

export class UserController {
  private dbInstance: DrizzleService;

  public constructor() {
    this.dbInstance = DrizzleService.getInstance();
  }

  public async signup(newUser: NewUser) {
    try {
      const id = await this.dbInstance.drizzleDb
        .insert(usersTable)
        .values(newUser)
        .returning({ id: usersTable.id });
      return id;
    } catch (error) {
      if (
        assertError(error, DrizzleQueryError) &&
        error.cause &&
        'code' in error.cause &&
        error.cause.code === '23505'
      ) {
        throw new UserAlreadyExistsError();
      }
      throw error;
    }
  }

  public async login(email: string): Promise<User | undefined> {
    try {
      const user = await this.dbInstance.drizzleDb
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
      if (user.length === 0) {
        return undefined;
      }
      return user[0];
    } catch (error) {
      throw error;
    }
  }
}
