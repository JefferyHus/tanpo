import { NextFunction, Request, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

import { GENERIC_ERRORS, HTTP_STATUS_CODES, JWT_SECRET } from '@/constants';
import { LogLevelsEnum } from '@/core/classes/logger/logger.types';
import { RedisFactory } from '@/redis.factory';
import { logger } from '@/utils/logger';

// create an authenticated decorator
export function Authenticated() {
  return (request: Request, response: Response, next: NextFunction) => {
    // verify the token
    try {
      const session = request.session;

      // check if the session is valid
      if (!session) {
        return response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          code: HTTP_STATUS_CODES.UNAUTHORIZED,
          cause: 'Session not found',
          message: GENERIC_ERRORS.UNAUTHORIZED,
        });
      }

      // check if the session has a user
      if (!session.user?.id) {
        return response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          code: HTTP_STATUS_CODES.UNAUTHORIZED,
          cause: 'User not found',
          message: GENERIC_ERRORS.UNAUTHORIZED,
        });
      }

      // attach the user to the request
      request.user = session.user;

      // call the next middleware
      next();
    } catch (error) {
      logger(LogLevelsEnum.ERROR, 'Error verifying token', {
        error,
      });

      return response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        code: HTTP_STATUS_CODES.UNAUTHORIZED,
        cause: 'Session not found',
        message: GENERIC_ERRORS.UNAUTHORIZED,
      });
    }
  };
}

// create a JWT authenticated decorator
export function JWTAuthenticated() {
  return async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    // Verify the token
    try {
      const token = request.headers.authorization?.split(' ')[1];

      if (!token) {
        response
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });

        return;
      }

      const decodedToken = jwt.verify(token, JWT_SECRET) as {
        id: number;
        role: string;
      };

      if (!decodedToken) {
        response
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });

        return;
      }

      // Check if the token is in the list of valid tokens in Redis
      const tokenInRedis = await RedisFactory.client.get(
        `refreshToken:${decodedToken.id}`,
      );

      if (!tokenInRedis) {
        response
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });

        return;
      }

      // Attach the user ID to the request
      request.user = {
        id: decodedToken.id,
        role: decodedToken.role,
      };

      request.token = {
        access: token,
        refresh: tokenInRedis,
      };

      // Call the next middleware
      next();
    } catch (error) {
      logger(LogLevelsEnum.ERROR, 'Error verifying token', {
        error,
      });

      response
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }
  };
}
