import jwt from 'jsonwebtoken';
import { env } from '../config/env-config';

const getJWT = function (id: number): string {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
      data: {
        id: id,
      },
    },
    env.JWT_SECRET,
  );
};

const checkJWT = function (token: string): { id: number } | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded as { id: number };
  } catch (error) {
    return null;
  }
};

export { getJWT,checkJWT };
