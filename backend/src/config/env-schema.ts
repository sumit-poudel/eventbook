import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(9090),
  DATABASE_URL: z.string().url(),
  SALT_ROUNDS: z.coerce.number().default(10),
  JWT_SECRET: z.string().min(4).default('sumitdai'),
});

export type EnvVars = z.infer<typeof envSchema>;
