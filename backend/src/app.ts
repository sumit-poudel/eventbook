import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import router from "./route";
import { requestLogger } from "./utils/logger";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger);
app.use(router);

export { app };
