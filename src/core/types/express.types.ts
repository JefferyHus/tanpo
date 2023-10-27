import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';

export enum RouteMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  OPTIONS = 'options',
  HEAD = 'head',
}

export type Route = {
  path: string;
  method: RouteMethods;
  handler: (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<Response>;
  function: (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<Response>;
  name: string;
};

export type Middleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<Response>;

export type Interceptor = (
  request: Request,
  response: Response,
  next: NextFunction,
) => void;

declare module 'express-session' {
  export interface SessionData {
    user: {
      id: number;
      role: string;
    };
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    user: {
      id: number;
      role: string;
    };
    token: {
      access: string;
      refresh: string;
    };
  }
}
