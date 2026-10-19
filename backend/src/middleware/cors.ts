import type { CorsOptions } from 'cors';
import { env } from '../config/env-config';

const corsOption: CorsOptions = {
  origin: env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
};

export { corsOption };
