import type { Request, Response } from 'express';
import { loginSchema } from '../schemas/user-schema';
import { ClientError, ServerError } from '../utils/errors';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { UserController } from '../db/user-controller';
import { compareHash } from '../utils/encrypt';

export const login = async (req: Request, res: Response): Promise<void> => {
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
    if (compareHash(password, user.password)) {
      res.status(StatusCodes.OK).json({
        message: 'User logged in successfully',
        id: user.id,
      });
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
