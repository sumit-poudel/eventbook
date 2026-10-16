import type { Request, Response } from 'express';
import { loginSchema } from '../schemas/user-schema';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const validatedData = loginSchema.safeParse({ email, password });
  if (!validatedData.success) {
    res.status(400).json({ error: validatedData.error.message });
    return;
  }
};
