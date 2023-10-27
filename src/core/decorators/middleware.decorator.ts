import { ROUTER_MIDDLEWARES_METADATA } from '@/constants';
import { RequestHandler } from 'express-serve-static-core';

export function Middleware(...handlers: RequestHandler[]): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const middlewares =
      Reflect.getMetadata(ROUTER_MIDDLEWARES_METADATA, descriptor.value) || [];

    for (const handler of handlers) {
      middlewares.push({ handler, key });
    }

    Reflect.defineMetadata(
      ROUTER_MIDDLEWARES_METADATA,
      middlewares,
      descriptor.value,
    );

    return descriptor;
  };
}
