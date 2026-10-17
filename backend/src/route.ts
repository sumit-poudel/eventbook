import { Router } from 'express';
import { Check } from './handlers/globTest';
import { login, logout, signup } from './handlers/user';
import {
  authenticate,
  requireAdmin,
  requireAuthentication,
} from './middleware/authenticate';
import { getAllEvent, getEventById } from './handlers/event';

const router = Router();

const dynamic = [authenticate];

router.get('/events', dynamic, getAllEvent);
router.get('/event/:id', dynamic,getEventById);
router.post('/signup', dynamic, signup);
router.post('/login', dynamic, login);

const safeGuarded = dynamic.concat(requireAuthentication);
router.get('/check', safeGuarded, Check.check);
router.get('/logout', safeGuarded, logout);

const adminGuarded = safeGuarded.concat(requireAdmin);
router.get('/check-admin', adminGuarded, Check.checkAdmin);

export default router;
