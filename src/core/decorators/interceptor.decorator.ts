import { NextFunction, Request, Response } from 'express-serve-static-core';

import { ROUTER_INTERCEPTORS_METADATA } from '@/constants';

export type InterceptorFunction = (
  request: Request,
  response: Response,
  next: NextFunction,
) => void;

export const Interceptor = (
  interceptor: InterceptorFunction,
): MethodDecorator => {
  return (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const interceptors =
      Reflect.getMetadata(ROUTER_INTERCEPTORS_METADATA, descriptor.value) || [];

    interceptors.push({
      handler: interceptor,
      key: propertyKey,
    });

    Reflect.defineMetadata(
      ROUTER_INTERCEPTORS_METADATA,
      interceptors,
      descriptor.value,
    );

    return descriptor;
  };
};
