import type { NextFunction, Request, Response } from 'express';
import { checkJWT } from '../utils/jwt';
import { ClientError } from '../utils/errors';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { getCookies } from '../utils/cookies';
import { UserController } from '../db/user-controller';

const authenticate = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.user = {
    id: null,
    isAuthenticated: false,
    role: null,
  };
  const token = getCookies(req, 'token');
  const authContext = token ? checkJWT(token) : null;
  if (authContext == null) {
    next();
    return;
  }
  const userController = new UserController();
  userController
    .getUserById(authContext.id)
    .then((user) => {
      if (user) {
        req.user.id = user.id;
        req.user.isAuthenticated = true;
        req.user.role = user.role;
      }
      next();
    })
    .catch((error: unknown) => {
      next(error);
    });
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

const requireAdmin = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user.isAuthenticated || req.user.role !== 'admin') {
    const clientError = new ClientError(
      StatusCodes.FORBIDDEN,
      getReasonPhrase(StatusCodes.FORBIDDEN),
    );
    clientError.sendErrorResponse(res);
    return;
  }
  next();
};

export { authenticate, requireAuthentication, requireAdmin };
