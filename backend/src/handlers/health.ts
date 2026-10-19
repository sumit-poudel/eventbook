import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const apiRoutes = [
  { method: 'GET', path: '/', auth: false },
  { method: 'GET', path: '/health', auth: false },
  { method: 'GET', path: '/events', auth: false },
  { method: 'GET', path: '/event/:id', auth: false },
  { method: 'GET', path: '/profile/whoami', auth: false },
  { method: 'POST', path: '/signup', auth: false },
  { method: 'POST', path: '/login', auth: false },
  { method: 'GET', path: '/profile/booking', auth: true },
  { method: 'GET', path: '/logout', auth: true },
  { method: 'PUT', path: '/book', auth: true },
  { method: 'DELETE', path: '/cancel', auth: true },
  { method: 'GET', path: '/admin/events', auth: true },
  { method: 'POST', path: '/admin/event', auth: true },
  { method: 'PATCH', path: '/admin/event/:id', auth: true },
  { method: 'DELETE', path: '/admin/event/:id', auth: true },
];

const index = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    name: 'eventbook api',
    status: 'ok',
    routes: apiRoutes,
  });
};

const health = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ status: 'ok' });
};

export { index, health };
