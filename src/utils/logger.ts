import * as Sentry from '@sentry/node';
import { NextFunction, Request, Response } from 'express-serve-static-core';

import { GENERIC_ERRORS, HTTP_STATUS_CODES } from '@/constants';
import { BaseError } from '@/core/classes/errors/base.error';
import { WinstonIntegration } from '@/core/classes/logger/integrations/winston.class';
import { LogLevels, LogLevelsEnum } from '@/core/classes/logger/logger.types';

import { isPrismaKnownError, isZodError } from './error';

export type Context = Record<string, unknown> | string | Array<unknown>;

export type ErrorObject = {
  code: number | string;
  cause: unknown;
  message: string;
};

export function logger(
  level: LogLevels,
  error: unknown,
  context?: Context,
): void {
  // function to check if the log level is valid
  function isLoggable(level: string): level is LogLevels {
    return [
      'error',
      'warn',
      'info',
      'http',
      'verbose',
      'debug',
      'silly',
      'http',
    ].includes(level as LogLevels);
  }

  // check if the logger is enabled, DEBUG_MODE is set to either * or server
  if (process.env.DEBUG_MODE === '*' || process.env.DEBUG_MODE === 'server') {
    const winston = new WinstonIntegration();

    // setup the logger
    if (!winston.initialized()) {
      winston.setup({
        level: process.env.LOG_LEVEL ?? 'debug',
        exitOnError: false,
      });
    }

    // check if the log level is valid
    if (!isLoggable(level)) {
      throw new Error(`Invalid log level: ${level}`);
    }

    winston.log(level, error, context);
  }

  // if the mode is set to sentry, send the error to sentry
  if (process.env.DEBUG_MODE === '*' || process.env.DEBUG_MODE === 'sentry') {
    Sentry.captureException(error, {
      extra: {
        context,
      },
    });
  }
}

export function handleErrorMessage(error: unknown): ErrorObject {
  if (error instanceof Error) {
    logger(LogLevelsEnum.ERROR, error.message, { error });
  }

  if (error instanceof BaseError) {
    return {
      code: error.status,
      cause: 'unknown',
      message: error.message,
    };
  }

  if (isPrismaKnownError(error)) {
    return {
      code: error.code,
      cause: error.meta?.cause,
      message: GENERIC_ERRORS.BAD_REQUEST,
    };
  }

  if (isZodError(error)) {
    return {
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      cause: error.issues,
      message: error.message,
    };
  }

  return {
    code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    cause: 'unknown',
    message: GENERIC_ERRORS.SERVER_ERROR,
  };
}

export function httpErrorHandler(): (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => void {
  return (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
  ): void => {
    if (error instanceof Error) {
      logger(LogLevelsEnum.ERROR, GENERIC_ERRORS.EXPECTATION_FAILED, { error });
    }

    response.status(HTTP_STATUS_CODES.EXPECTATION_FAILED).json({
      error: handleErrorMessage(error),
    });

    return next(error);
  };
}
