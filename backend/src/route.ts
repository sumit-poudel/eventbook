import { Router } from "express";
import {Check} from "./handlers/globTest";
import { signup } from "./handlers/signup";

const router = Router();

router.get('/test', Check.check);
router.post('/signup', signup);
export default router;
