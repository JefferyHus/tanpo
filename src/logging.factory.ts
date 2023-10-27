import { AppFactory } from '@/app.factory';
import { SentryIntegration } from '@/core/classes/logger/integrations/sentry.class';
import { WinstonIntegration } from '@/core/classes/logger/integrations/winston.class';
import { LogLevelsEnum } from '@/core/classes/logger/logger.types';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import * as Tracing from '@sentry/tracing';
import { ErrorRequestHandler, RequestHandler } from 'express-serve-static-core';
import { IncomingMessage, ServerResponse } from 'http';
import morgan from 'morgan';
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
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.OnUncaughtException({
          onFatalError: (error) => {
            Sentry.captureException(error);
            process.exit(1);
          },
        }),
        new Sentry.Integrations.OnUnhandledRejection({
          mode: 'strict',
        }),
        new Tracing.Integrations.Express({
          app: AppFactory.app,
        }),
        new ProfilingIntegration(),
      ],
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE),
      profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE),
    });
    this.winston.setup();
  }

  static request(): RequestHandler {
    return Sentry.Handlers.requestHandler();
  }

  static error(): ErrorRequestHandler {
    return Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Capture all 400, 404 and 500 errors
        return (
          error.status === 400 || error.status === 404 || error.status === 500
        );
      },
    });
  }

  static tracing(): RequestHandler {
    return Sentry.Handlers.tracingHandler();
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
