import { RedisStore } from 'connect-redis';
import { RequestHandler } from 'express-serve-static-core';
import session, { SessionOptions, Store } from 'express-session';
import Redis from 'ioredis';

import { LogLevelsEnum } from './core/classes/logger/logger.types';
import { SessionCookieSameSite } from './core/types/generic.types';
import { logger } from './utils/logger';

export class SessionFactory {
  private static _session: RequestHandler;
  private static _sessionOptions: SessionOptions;
  private static _sessionStore: Store;
  private static _redisClient: Redis;

  static create(options?: SessionOptions, store?: Store): RequestHandler {
    if (this._session) {
      return this._session;
    }

    this._redisClient = new Redis({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });

    this._sessionStore =
      store ||
      new RedisStore({
        client: this._redisClient,
        prefix: String(process.env.REDIS_PREFIX) ?? '',
      });

    this._sessionOptions = options || {
      name: String(process.env.SESSION_COOKIE_NAME),
      secret: String(process.env.SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
      store: this._sessionStore,
      cookie: {
        secure: String(process.env.SESSION_COOKIE_SECURE) === 'true',
        httpOnly: true,
        sameSite: String(
          process.env.SESSION_COOKIE_SAME_SITE,
        ) as SessionCookieSameSite,
        maxAge: Number(process.env.SESSION_MAX_AGE),
      },
    };

    this._redisClient.on(LogLevelsEnum.ERROR, (error) => {
      logger(LogLevelsEnum.ERROR, error);
    });

    this._redisClient.info((error) => {
      if (error) {
        logger(LogLevelsEnum.ERROR, error);
      } else {
        logger(LogLevelsEnum.INFO, 'Redis client connected');
      }
    });

    return (this._session = session(this._sessionOptions));
  }

  static get session(): RequestHandler {
    return this._session;
  }

  static get redisClient(): Redis {
    return this._redisClient;
  }
}
