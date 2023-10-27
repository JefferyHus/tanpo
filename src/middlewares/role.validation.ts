import { GENERIC_ERRORS, HTTP_STATUS_CODES } from '@/constants';
import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express-serve-static-core';

export function RoleValidation(roles: Role) {
  return function (request: Request, response: Response, next: NextFunction) {
    const user = request.user;
    if (!user) {
      return response.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        code: HTTP_STATUS_CODES.UNAUTHORIZED,
        cause: 'User not found',
        message: GENERIC_ERRORS.UNAUTHORIZED,
      });
    }

    if (!roles.includes(user.role)) {
      return response.status(HTTP_STATUS_CODES.FORBIDDEN).json({
        code: HTTP_STATUS_CODES.FORBIDDEN,
        cause: 'Role not allowed',
        message: GENERIC_ERRORS.FORBIDDEN,
      });
    }

    return next();
  };
}
