import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';

export function isPrismaKnownError(
  error: any,
): error is PrismaClientKnownRequestError {
  return (
    error &&
    typeof error.code === 'string' &&
    typeof error.clientVersion === 'string' &&
    (error.meta === undefined || typeof error.meta === 'object') &&
    (error.batchRequestIdx === undefined ||
      typeof error.batchRequestIdx === 'number')
  );
}

export function isZodError(obj: any): obj is ZodError {
  return obj instanceof ZodError;
}
