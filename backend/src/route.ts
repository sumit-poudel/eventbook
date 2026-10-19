import { Router } from 'express';
import type { Request } from 'express';
import cors from 'cors';
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
import {
  addEvent,
  getEvents,
  manageEvent,
  removeEvent,
} from './handlers/admin';
import { whoami, bookings } from './handlers/profile';
import { health, index } from './handlers/health';
import { corsOption } from './middleware/cors';

const router = Router();
const dynamic = [cors<Request>(corsOption), authenticate];

router.get('/', index);
router.get('/health', health);
router.get('/events', dynamic, getAllEvent);
router.get('/event/:id', dynamic, getEventById);
router.get('/profile/whoami', dynamic, whoami);
router.post('/signup', dynamic, signup);
router.post('/login', dynamic, login);

const safeGuarded = dynamic.concat(requireAuthentication);
router.get('/profile/booking', safeGuarded, bookings);
router.get('/logout', safeGuarded, logout);
router.put('/book', safeGuarded, bookEvent);
router.delete('/cancel', safeGuarded, cancelBooking);

const adminGuarded = safeGuarded.concat(requireAdmin);
router.get('/admin/events', adminGuarded, getEvents);
router.post('/admin/event', adminGuarded, addEvent);
router.patch('/admin/event/:id', adminGuarded, manageEvent);
router.delete('/admin/event/:id', adminGuarded, removeEvent);

export default router;
