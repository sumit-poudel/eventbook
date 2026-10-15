import type { Request, Response } from "express";
import { signupSchema } from "../schemas/user-schema";
import { UserController } from "../db/user-controller";
import { UserAlreadyExistsError } from "../utils/errors";

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, age, name } = req.body;
    const validatedData = signupSchema.safeParse({ email, password, age, name });
    if (!validatedData.success) {
        res.status(400).json({ error: validatedData.error.message });
        return;
    }
    const userController = new UserController(validatedData.data.name, validatedData.data.age, validatedData.data.email, validatedData.data.password);
    try{
    const id = await userController.signup();
    res.status(201).json({ message: "User created successfully", id: id });
    }catch(error){
        if (error instanceof UserAlreadyExistsError) {
            res.status(400).json({ error: "User Email already exists. Please try a different email." });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}