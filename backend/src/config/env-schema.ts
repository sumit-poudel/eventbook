import { z } from "zod";

export const envSchema = z.object({
	PORT: z.coerce.number().default(9090),
	DATABASE_URL: z.string().url(),
});

export type EnvVars = z.infer<typeof envSchema>;
