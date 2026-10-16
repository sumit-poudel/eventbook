import express, { type Application } from 'express';
import router from './route';
import { requestLogger } from './utils/logger';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(router);

export { app };
