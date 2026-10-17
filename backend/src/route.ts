import { Router } from 'express';
import { Check } from './handlers/globTest';
import {
  authenticate,
  requireAdmin,
  requireAuthentication,
} from './middleware/authenticate';
import {
  getAllEvent,
  getEventById,
  bookEvent,
  cancelBooking,
} from './handlers/event';
import { login, logout, signup } from './handlers/user';
import { addEvent, getEvents, manageEvent } from './handlers/admin';

const router = Router();

const dynamic = [authenticate];

router.get('/events', dynamic, getAllEvent);
router.get('/event/:id', dynamic, getEventById);
router.post('/signup', dynamic, signup);
router.post('/login', dynamic, login);

const safeGuarded = dynamic.concat(requireAuthentication);
router.get('/check', safeGuarded, Check.check);
router.get('/logout', safeGuarded, logout);
router.put('/book', safeGuarded, bookEvent);
router.delete('/cancel', safeGuarded, cancelBooking);

const adminGuarded = safeGuarded.concat(requireAdmin);
router.get('/check-admin', adminGuarded, Check.checkAdmin);
router.get('/admin/events', adminGuarded, getEvents);
router.post('/admin/event', adminGuarded, addEvent);
router.patch('/admin/event/:id', adminGuarded, manageEvent);

export default router;
