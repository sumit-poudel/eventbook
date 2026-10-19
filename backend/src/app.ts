import express, { type Application } from 'express';
import router from './route';
import { requestLogger } from './utils/logger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app: Application = express();

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use('/static', express.static('public'));
app.use(router);

export { app };
