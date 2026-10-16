import { Router } from 'express';
import { Check } from './handlers/globTest';
import { signup } from './handlers/signup';
import { login } from './handlers/login';
import {
  authenticate,
  requireAdmin,
  requireAuthentication,
} from './middleware/authenticate';

const router = Router();

const dynamic = [authenticate];

router.post('/signup', dynamic, signup);
router.post('/login', dynamic, login);

const safeGuarded = dynamic.concat(requireAuthentication);
router.get('/check', safeGuarded, Check.check);

const adminGuarded = safeGuarded.concat(requireAdmin);
router.get('/check-admin', adminGuarded, Check.checkAdmin);

export default router;
