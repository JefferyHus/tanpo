import { NextFunction, Request, Response } from 'express-serve-static-core';
import { ZodObject, ZodRawShape } from 'zod';

import { HTTP_STATUS_CODES } from '@/constants';
import { handleErrorMessage } from '@/utils/logger';

export function SchemaValidation<T extends ZodRawShape>(schema: ZodObject<T>) {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = schema.parse(request.body);
      request.body = body;
      next();
    } catch (error) {
      const { code, message, cause } = handleErrorMessage(error);

      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        code,
        cause,
        message,
      });
    }
  };
}
