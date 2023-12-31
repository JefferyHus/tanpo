import { NextHandleFunction } from 'connect';
import express, { Router } from 'express';
import {
  Handler,
  RawBodyRequest,
  RequestHandler,
} from 'express-serve-static-core';
import { IncomingMessage, ServerResponse } from 'http';
import Container from 'typedi';

import {
  BODY_PARSER_OPTIONS_METADATA,
  ROUTER_INTERCEPTORS_METADATA,
  ROUTER_METHODS_METADATA,
  ROUTER_MIDDLEWARES_METADATA,
} from './constants';
import { ParserOptions } from './core/decorators/http/parser.decorator';
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

        // construct the route properties
        const routeProperties: {
          path: string;
          middlewares?: Middleware[];
          interceptors?: Interceptor[];
          parserOptions?: NextHandleFunction;
          function: Handler;
        } = {
          path: route.path,
          function: route.function,
        };

        // add the middlewares to the router
        if (middlewares.length > 0) {
          middlewares.forEach((middleware) => {
            // bind the instance to the middleware
            middleware.bind(instance);
          });

          routeProperties['middlewares'] = middlewares;
        }

        // get http parser options from the metadata
        const parserOptions = this.resolveParserOptions(route.handler);

        // add the parser options to the router
        if (parserOptions) {
          routeProperties['parserOptions'] = parserOptions;
        }

        // build the route
        router[route.method](
          routeProperties.path,
          routeProperties.parserOptions ?? [],
          routeProperties.middlewares ?? [],
          routeProperties.function,
        );
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

  private static resolveParserOptions(identifier: RequestHandler) {
    // get the parser options from the metadata
    const routerParserOptions: ParserOptions = Reflect.getMetadata(
      BODY_PARSER_OPTIONS_METADATA,
      identifier,
    );

    // build a middleware to parse the request body
    // express already has a middleware to parse the request body
    // (e.g. express.json(), express.urlencoded(), express.raw(), etc.)
    // determine which middleware to use based on the parser options
    if (routerParserOptions) {
      if (routerParserOptions.body === 'json') {
        // check if verify function is set
        return express.json({
          inflate: routerParserOptions.inflate,
          strict: routerParserOptions.strict,
          limit: routerParserOptions.limit,
          type: routerParserOptions.type,
        });
      }

      if (routerParserOptions.body === 'urlencoded') {
        // check if verify function is set
        return express.urlencoded({
          inflate: routerParserOptions.inflate,
          extended: routerParserOptions.extended,
          limit: routerParserOptions.limit,
          type: routerParserOptions.type,
        });
      }

      if (routerParserOptions.body === 'raw') {
        // check if verify function is set
        return express.raw({
          inflate: routerParserOptions.inflate,
          limit: routerParserOptions.limit,
          type: routerParserOptions.type,
          verify: (
            request: RawBodyRequest<IncomingMessage>,
            _response: ServerResponse<IncomingMessage>,
            buffer: Buffer,
          ) => {
            if (Buffer.isBuffer(buffer)) {
              request.rawBody = buffer;
            }

            return true;
          },
        });
      }

      if (routerParserOptions.body === 'text') {
        // check if verify function is set
        return express.text({
          inflate: routerParserOptions.inflate,
          limit: routerParserOptions.limit,
          type: routerParserOptions.type,
        });
      }
    }

    return null;
  }
}
