import jwt from 'jsonwebtoken';
import { env } from '../config/env-config';

const getJWT = function (id: number): string {
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '12h' });
};

const checkJWT = function (token: string): { id: number } | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    if (typeof decoded === 'string' || typeof decoded.id !== 'number') {
      return null;
    }
    return { id: decoded.id };
  } catch {
    return null;
  }
};

export { getJWT, checkJWT };
