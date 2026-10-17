import type { CookieOptions, Request, Response } from 'express';

const setCookies = function (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions,
) {
  res.cookie(name, value, options);
};

const getCookies = function (req: Request, name: string): string | undefined {
  return req.cookies[name];
};

const clearCookies = function (
  res: Response,
  name: string,
  options: CookieOptions,
) {
  res.clearCookie(name, options);
};

export { setCookies, getCookies, clearCookies };
