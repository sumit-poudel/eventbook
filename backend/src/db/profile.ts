import { eq } from 'drizzle-orm';
import { DrizzleService } from '../config/drizzle-setup';
import type { GetProfile } from '../schemas/profile-schema';
import { getProfileSchema } from '../schemas/profile-schema';
import { usersTable } from './schema';

class Profile {
  private readonly id: number;
  private readonly dbInstance: DrizzleService;

  constructor(id: number) {
    this.id = id;
    this.dbInstance = DrizzleService.getInstance();
  }

  public async getProfile(): Promise<GetProfile> {
    const [user] = await this.dbInstance.drizzleDb
      .select({
        userId: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        age: usersTable.age,
      })
      .from(usersTable)
      .where(eq(usersTable.id, this.id))
      .limit(1);
    if (!user) {
      throw new Error('User not found');
    }
    return getProfileSchema.parse(user);
  }
}

export { Profile };
