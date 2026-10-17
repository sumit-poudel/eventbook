import dotenv from "dotenv";
import fs from "node:fs";
import { type EnvVars, envSchema } from "./env-schema";
import logger from "../utils/logger";

const envFile = ".env";

if (fs.existsSync(envFile)) {
	dotenv.config({ path: envFile });
} else {
	logger.error(envFile + " not found! using default values");
}

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.log("invalid enviroment vars");
	process.exit(1);
}
const env: EnvVars = parsedEnv.data;

export { env };
