import type { Role } from '../db/schema';

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: number | null;
        isAuthenticated: boolean;
        role: Role | null;
      };
    }
  }
}
