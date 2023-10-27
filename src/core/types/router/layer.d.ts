import { RequestHandler } from 'express-serve-static-core';
import { Options, Token } from 'path-to-regexp';

declare interface Layer {
  handle?: RequestHandler;
  name: string;
  params?: unknown;
  path?: string;
  keys: Token[];
  regexp: RegExp;
  method: string;
}

declare const Layer: {
  (path: string, options?: Options, fn?: RequestHandler): Layer;
  new (path: string, options?: Options, fn?: RequestHandler): Layer;
};

export = Layer;
