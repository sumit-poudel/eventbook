import { env } from './env-config';
import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { defineRelations } from 'drizzle-orm';
import * as schema from '../db/schema';

const relations = defineRelations(schema);

class DrizzleService {
  private static instance: DrizzleService;
  private readonly client: postgres.Sql;
  private db: PostgresJsDatabase<typeof relations>;

  constructor() {
    this.client = postgres(env.DATABASE_URL);
    this.db = drizzle({ client: this.client, relations });
  }

  public static getInstance(): DrizzleService {
    if (!this.instance) {
      this.instance = new DrizzleService();
    }
    return this.instance;
  }

  public get drizzleDb(): PostgresJsDatabase<typeof relations> {
    return this.db;
  }

  public async closeConnection(): Promise<void> {
    await this.client.end({ timeout: 5 });
  }
}

export { DrizzleService };
