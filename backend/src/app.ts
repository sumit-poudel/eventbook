import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import router from "./route";

const app: Application = express();

app.use(express.json());
app.use(router);

export { app };
