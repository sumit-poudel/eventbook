import { fileURLToPath } from 'node:url';
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
import { whoami, bookings } from './handlers/profile';

const router = Router();

const indexPath = fileURLToPath(
  new URL('../public/index.html', import.meta.url),
);

router.get('/', (_req, res) => {
  res.sendFile(indexPath);
});

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const dynamic = [authenticate];

router.get('/events', dynamic, getAllEvent);
router.get('/event/:id', dynamic, getEventById);
router.get('/profile/whoami', dynamic, whoami);
router.post('/signup', dynamic, signup);
router.post('/login', dynamic, login);

const safeGuarded = dynamic.concat(requireAuthentication);
router.get('/check', safeGuarded, Check.check);
router.get('/profile/booking', safeGuarded, bookings);
router.get('/logout', safeGuarded, logout);
router.put('/book', safeGuarded, bookEvent);
router.delete('/cancel', safeGuarded, cancelBooking);

const adminGuarded = safeGuarded.concat(requireAdmin);
router.get('/check-admin', adminGuarded, Check.checkAdmin);
router.get('/admin/events', adminGuarded, getEvents);
router.post('/admin/event', adminGuarded, addEvent);
router.patch('/admin/event/:id', adminGuarded, manageEvent);

export default router;
