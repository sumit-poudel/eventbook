import {env} from './env-config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

export class DrizzleService{
    private static instance: DrizzleService;
    private db:any;

    constructor(){
        const client = postgres(env.DATABASE_URL);
        this.db = drizzle({client});
    }

    public static getInstance(): DrizzleService {
        if(!this.instance){
            this.instance = new DrizzleService();
        }
        return this.instance;
    }
    public get drizzleDb():any{
        return this.db;
    }
}