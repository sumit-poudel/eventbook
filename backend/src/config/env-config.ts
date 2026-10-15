import dotenv from "dotenv";
import fs from "node:fs";
import { type EnvVars, envSchema } from "./env-schema";

const envFile = ".env";

if (fs.existsSync(envFile)) {
	dotenv.config({ path: envFile });
} else {
	console.log(envFile + " not found! using default values");
}

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.log("invalid enviroment vars");
	process.exit(1);
}
export const env: EnvVars = parsedEnv.data;
