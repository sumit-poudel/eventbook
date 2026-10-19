import { z } from 'zod';

const getProfileSchema = z.object({
  userId: z.number().int().positive(),
  name: z.string().min(3).max(255),
  email: z.string().email(),
  age: z.number().int().min(18).max(100),
});

type GetProfile = z.infer<typeof getProfileSchema>;

export { getProfileSchema, type GetProfile };
