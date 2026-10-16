import type { NextFunction, Request, Response } from 'express';
import { checkJWT } from '../utils/jwt';
import { ClientError } from '../utils/errors';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

const authenticate = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.user = {
    id: null,
    isAuthenticated: false,
  };
  const authContext = checkJWT(req.cookies.token);
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
