import { DrizzleService } from "../config/drizzle-setup";
import { usersTable } from "./schema";


export class UserController{
    private readonly name: string;
    private readonly age: number;
    private readonly email: string;
    private readonly password: string;
    constructor(name: string, age: number, email: string, password: string){
        this.name = name;
        this.age = age;
        this.email = email;
        this.password = password;
    }

    public async newUser() {
        const id = await DrizzleService.getInstance().drizzleDb.insert(usersTable).values({name:this.name, age:this.age, email:this.email, password:this.password}).returning({id: usersTable.id});
        return id;
    }
}