import { Router } from "express";
import {Check} from "./handlers/globTest";
import { signup } from "./handlers/signup";
import { login } from "./handlers/login";

const router = Router();

router.get('/test', Check.check);
router.post('/signup', signup);
router.post('/login',login)
export default router;
