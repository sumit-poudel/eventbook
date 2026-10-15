import { Router } from "express";
import {Check} from "./handlers/globTest";

const router = Router();

router.get('/test', Check.check);

export default router;
