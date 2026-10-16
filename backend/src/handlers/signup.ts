import type { Request, Response } from 'express';
import { signupSchema } from '../schemas/user-schema';
import { UserController } from '../db/user-controller';
import {
  ServerError,
  UserAlreadyExistsError,
  assertError,
} from '../utils/errors';
import { ClientError } from '../utils/errors';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { encryptedHash } from '../utils/encrypt';
import { getJWT } from '../utils/jwt';
import { setCookies, clearCookies } from '../utils/cookies';

export const signup = async (req: Request, res: Response): Promise<void> => {
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
    clearCookies(res, 'token');
    setCookies(res, 'token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
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
