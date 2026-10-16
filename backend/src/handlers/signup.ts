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
  validatedData.data.password = encryptedHash(validatedData.data.password);
  try {
    const id = await userController.signup(validatedData.data);
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
