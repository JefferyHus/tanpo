import { NextFunction, Request, Response } from 'express-serve-static-core';
import { inspect } from 'util';

import {
  GENERIC_ERRORS,
  HTTP_STATUS_CODES,
  ROUTER_METHODS_METADATA,
} from '@/constants';
import { BaseError } from '@/core/classes/errors/base.error';
import { LogLevelsEnum } from '@/core/classes/logger/logger.types';
import { Route, RouteMethods } from '@/core/types/express.types';
import { isPrismaKnownError } from '@/utils/error';
import { logger } from '@/utils/logger';

export type RouteDecoratorMetadata = {
  path: string;
  method: RouteMethods;
};

export function RequestMapping(metadata: RouteDecoratorMetadata) {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const routes: Route[] = [];
    const handler = descriptor.value;

    // edit the descriptor value to handle the response error
    descriptor.value = async function (
      request: Request,
      response: Response,
      next: NextFunction,
    ) {
      try {
        await handler.call(this, request, response, next);
      } catch (error) {
        logger(
          LogLevelsEnum.ERROR,
          `
          \nError:\n ${JSON.stringify(error, null, 2)}
          \nRequest Query:\n ${inspect(request.query, false, 2, true)}
          \nRequest Params:\n ${inspect(request.params, false, 2, true)}
          \nRequest Body:\n ${inspect(request.body, false, 2, true)}
          \nRequest Headers:\n ${inspect(request.headers, false, 2, true)}
        `,
          {
            propertyKey,
            target,
            descriptor,
            error,
          },
        );

        // if the error is an instance of BaseError, then it should contain the status code
        if (error instanceof BaseError) {
          return response.status(error.status).json({
            code: error.status,
            cause: error.cause,
            message: error.toString(),
          });
        }

        // it can also be a prisma error, if the error code starts with P, then it's a prisma error
        if (isPrismaKnownError(error)) {
          return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            code: error.code,
            cause: error.meta?.cause,
            message: GENERIC_ERRORS.BAD_REQUEST,
          });
        }

        if (error instanceof Error) {
          return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            code: HTTP_STATUS_CODES.BAD_REQUEST,
            cause: error.cause ?? 'unknown',
            message: error.message.toString(),
          });
        }

        // otherwise, return a { HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR } error
        return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
          cause: 'unknown',
          message: GENERIC_ERRORS.SERVER_ERROR,
        });
      }
    };

    if (Reflect.hasMetadata(ROUTER_METHODS_METADATA, target.constructor)) {
      routes.push(
        ...Reflect.getMetadata(ROUTER_METHODS_METADATA, target.constructor),
      );
    }

    Reflect.defineMetadata(
      ROUTER_METHODS_METADATA,
      [
        ...routes,
        {
          method: metadata.method,
          path: metadata.path,
          handler: handler,
          function: descriptor.value,
          name: propertyKey,
        },
      ],
      target.constructor,
    );

    return descriptor;
  };
}

export function createMappingDecorator(method: RouteMethods) {
  return (path: string): MethodDecorator => {
    return RequestMapping({
      path,
      method,
    });
  };
}

export const Delete = createMappingDecorator(RouteMethods.DELETE);
export const Get = createMappingDecorator(RouteMethods.GET);
export const Patch = createMappingDecorator(RouteMethods.PATCH);
export const Post = createMappingDecorator(RouteMethods.POST);
export const Put = createMappingDecorator(RouteMethods.PUT);
export const Options = createMappingDecorator(RouteMethods.OPTIONS);
export const Head = createMappingDecorator(RouteMethods.HEAD);
