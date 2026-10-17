import { DrizzleQueryError } from 'drizzle-orm';
import { DrizzleService } from '../config/drizzle-setup';
import { usersTable } from './schema';
import { assertError, UserAlreadyExistsError } from '../utils/errors';

type NewUser = typeof usersTable.$inferInsert;
type User = typeof usersTable.$inferSelect;

class UserController {
  private dbInstance: DrizzleService;

  public constructor() {
    this.dbInstance = DrizzleService.getInstance();
  }

  public async signup(newUser: NewUser): Promise<number> {
    try {
      const id = await this.dbInstance.drizzleDb
        .insert(usersTable)
        .values(newUser)
        .returning({ id: usersTable.id });
      const inserted = id[0];
      if (!inserted) {
        throw new Error('User was not created');
      }
      return inserted.id;
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
    const user = await this.dbInstance.drizzleDb.query.usersTable.findFirst({
      where: { email: email },
    });
    return user;
  }

  public async getUserById(id: number): Promise<User | undefined> {
    const user = await this.dbInstance.drizzleDb.query.usersTable.findFirst({
      where: { id: id },
    });
    return user;
  }
}

export { UserController, type User };
