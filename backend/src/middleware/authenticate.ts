import type { NextFunction, Request, Response } from 'express';
import { checkJWT } from '../utils/jwt';
import { ClientError } from '../utils/errors';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { getCookies } from '../utils/cookies';

const authenticate = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.user = {
    id: null,
    isAuthenticated: false,
  };
  const token = getCookies(req, 'token');
  const authContext = token ? checkJWT(token) : null;
  if (authContext != null) {
    req.user.id = authContext.id;
    req.user.isAuthenticated = true;
  }
  next();
};

const requireAuthentication = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user.isAuthenticated) {
    const clientError = new ClientError(
      StatusCodes.UNAUTHORIZED,
      getReasonPhrase(StatusCodes.UNAUTHORIZED),
    );
    clientError.sendErrorResponse(res);
    return;
  }
  next();
};

export { authenticate, requireAuthentication };
