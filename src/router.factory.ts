import { Router } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import Container from 'typedi';
import {
  ROUTER_INTERCEPTORS_METADATA,
  ROUTER_METHODS_METADATA,
  ROUTER_MIDDLEWARES_METADATA,
} from './constants';
import { Interceptor, Middleware, Route } from './core/types/express.types';
import { Identifier } from './core/types/generic.types';

export class RouterFactory {
  public static create<T>(identifier: Identifier<T>): Router {
    if (typeof identifier === 'string') {
      throw new Error(`Cannot create an instance of a string`);
    }

    return this.createRouter(identifier);
  }

  private static createRouter<T>(identifier: Identifier<T>): Router {
    if (typeof identifier === 'string') {
      throw new Error(`Cannot create an instance of a string`);
    }

    // get the instance of the controller
    const instance = Container.get(identifier);

    // get all the routes of the controller
    const routes = Reflect.getMetadata(ROUTER_METHODS_METADATA, identifier);

    // create the router
    const router = Router();

    // add the routes to the router
    if (routes) {
      routes.forEach((route: Route) => {
        // get the middlewares from the metadata
        const middlewares = this.resolveMiddlewares(route.handler);

        // bind the instance to the controller method
        route.function = route.function.bind(instance);

        // prepare the route middlewares and interceptors to be added to the router
        let routeMiddlewares: Middleware[] = [];

        // add the middlewares to the router
        if (middlewares.length > 0) {
          middlewares.forEach((middleware) => {
            // bind the instance to the middleware
            middleware.bind(instance);
          });

          routeMiddlewares = [...middlewares];
        }

        // if the route has both middlewares and interceptors, add them to the router
        if (routeMiddlewares.length > 0) {
          router[route.method](route.path, ...routeMiddlewares, route.function);
        } else {
          // if the route has no middlewares or interceptors, add it to the router
          router[route.method](route.path, route.function);
        }
      });
    }

    return router;
  }

  private static resolveMiddlewares(identifier: RequestHandler): Middleware[] {
    const middlewares: Middleware[] = [];

    // get the middlewares from the metadata
    const routerMiddlewares = Reflect.getMetadata(
      ROUTER_MIDDLEWARES_METADATA,
      identifier,
    );

    // add the router middlewares
    if (routerMiddlewares) {
      for (const middleware of routerMiddlewares) {
        middlewares.push(middleware.handler);
      }
    }

    return middlewares;
  }

  private static resolveInterceptors(
    identifier: RequestHandler,
  ): Interceptor[] {
    const interceptors: Interceptor[] = [];

    // get the interceptors from the metadata
    const routerInterceptors = Reflect.getMetadata(
      ROUTER_INTERCEPTORS_METADATA,
      identifier,
    );

    // add the router interceptors
    if (routerInterceptors) {
      for (const interceptor of routerInterceptors) {
        interceptors.push(interceptor.handler);
      }
    }

    return interceptors;
  }
}
