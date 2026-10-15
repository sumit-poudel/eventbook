import type { Request, Response } from "express";

export class LoginHandler{
    public static login(req: Request, res: Response): void{
        res.send("login");
    }
}