import bcrypt from 'bcrypt';
import { env } from '../config/env-config';

export const encryptedHash = function (password: string): string {
  const salt = bcrypt.genSaltSync(env.SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const compareHash = function (password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
};
