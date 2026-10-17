import type { Request, Response } from 'express';
import { loginSchema, signupSchema } from '../schemas/user-schema';
import {
  ClientError,
  ServerError,
  UserAlreadyExistsError,
  assertError,
} from '../utils/errors';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { UserController } from '../db/user-controller';
import { compareHash, encryptedHash } from '../utils/encrypt';
import { getJWT } from '../utils/jwt';
import { setCookies, clearCookies } from '../utils/cookies';

const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, age, name } = req.body;
  const validatedData = signupSchema.safeParse({ email, password, age, name });
  if (!validatedData.success) {
    const clientErr = new ClientError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      validatedData.error.message,
    );
    clientErr.sendErrorResponse(res);
    return;
  }
  const userController = new UserController();
  try {
    validatedData.data.password = encryptedHash(validatedData.data.password);
    const id = await userController.signup(validatedData.data);
    const token = getJWT(id);
    clearCookies(res, 'token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    setCookies(res, 'token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000,
    });
    res
      .status(StatusCodes.ACCEPTED)
      .json({ message: 'User created successfully', id: id });
  } catch (error) {
    if (assertError(error, UserAlreadyExistsError)) {
      const clientErr = new ClientError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        'User already exists!',
      );
      clientErr.sendErrorResponse(res);
      return;
    }
    const serverErr = new ServerError(
      getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    );
    serverErr.sendErrorResponse(res);
    return;
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const validatedData = loginSchema.safeParse({ email, password });
  if (!validatedData.success) {
    const clientError = new ClientError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      validatedData.error.message,
    );
    clientError.sendErrorResponse(res);
    return;
  }
  const userController = new UserController();
  try {
    const user = await userController.login(validatedData.data.email);
    if (!user) {
      const clientError = new ClientError(
        StatusCodes.UNAUTHORIZED,
        'User not found',
      );
      clientError.sendErrorResponse(res);
      return;
    }
    if (compareHash(validatedData.data.password, user.password)) {
      const token = getJWT(user.id);
      clearCookies(res, 'token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
      setCookies(res, 'token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 12 * 60 * 60 * 1000,
      });
      res.status(StatusCodes.OK).json({
        message: 'User logged in successfully',
        id: user.id,
      });
      return;
    }
    const clientError = new ClientError(
      StatusCodes.UNAUTHORIZED,
      'Invalid password',
    );
    clientError.sendErrorResponse(res);
    return;
  } catch {
    const serverErr = new ServerError(
      getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    );
    serverErr.sendErrorResponse(res);
    return;
  }
};

const logout = (req: Request, res: Response) => {
  clearCookies(res, 'token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
  res.status(StatusCodes.OK).send({ message: 'Logged out successfully' });
};

export { signup, login, logout };
