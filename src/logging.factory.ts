import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { RequestHandler } from 'express-serve-static-core';
import { IncomingMessage, ServerResponse } from 'http';
import morgan from 'morgan';

import { AppFactory } from '@/app.factory';
import { SentryIntegration } from '@/core/classes/logger/integrations/sentry.class';
import { WinstonIntegration } from '@/core/classes/logger/integrations/winston.class';
import { LogLevelsEnum } from '@/core/classes/logger/logger.types';

import { logger } from './utils/logger';

export class LoggingFactory {
  private static _sentry: SentryIntegration;
  private static _winston: WinstonIntegration;

  static get sentry(): SentryIntegration {
    if (!this._sentry) {
      this._sentry = new SentryIntegration();
    }
    return this._sentry;
  }

  static get winston(): WinstonIntegration {
    if (!this._winston) {
      this._winston = new WinstonIntegration();
    }
    return this._winston;
  }

  static create(): void {
    this.sentry.setup({
      enabled: process.env.SENTRY_ENABLED === 'true',
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      release: process.env.npm_package_version,
      beforeSendTransaction: (event: any) => {
        if (
          event.transaction?.includes('/auth/me') ||
          event.transaction?.includes('/health')
        ) {
          return null;
        }
        return event;
      },
      integrations: [
        Sentry.httpIntegration(),
        Sentry.onUncaughtExceptionIntegration({
          onFatalError: (error) => {
            Sentry.captureException(error);
            process.exit(1);
          },
        }),
        Sentry.onUnhandledRejectionIntegration({
          mode: 'strict',
        }),
        nodeProfilingIntegration(),
      ],
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE),
      profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE),
    });
    this.winston.setup();
  }

  static express(): void {
    this.sentry.setupExpress(AppFactory.app);
  }

  static morgan(): RequestHandler {
    return morgan(
      function (
        tokens: morgan.TokenIndexer,
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
      ) {
        return JSON.stringify({
          method: tokens.method(request, response),
          url: tokens.url(request, response),
          status: tokens.status(request, response),
          content_length: tokens.res(request, response, 'content-length'),
          response_time: tokens['response-time'](request, response),
        });
      },
      {
        stream: {
          // Configure Morgan to use our custom logger with the http severity
          write: (message: string): void => {
            const data = JSON.parse(message);
            if (data.url !== '/health') {
              logger(
                LogLevelsEnum.DEBUG,
                `${data.method} ${data.url}, status_code=${data.status}, response_ms=${data.response_time}`,
                data,
              );
            }
          },
        },
      },
    );
  }
}
