import * as Sentry from '@sentry/node';
import { NodeOptions } from '@sentry/node';
import { Application } from 'express';

import { LogLevels } from '@/core/classes/logger/logger.types';

import { Integration } from './integration.class';

export class SentryIntegration extends Integration {
  constructor(options?: NodeOptions) {
    super(options);
  }

  public setup<NodeOptions>(options?: NodeOptions): void {
    Sentry.init({
      ...options,
    });
  }

  public setupExpress(app: Application) {
    return Sentry.setupExpressErrorHandler(app);
  }

  public log(
    level: LogLevels,
    message: string,
    context: Record<string, unknown>,
  ): void {
    Sentry.withScope((scope) => {
      scope.setLevel(level as Sentry.SeverityLevel);
      scope.setContext('context', context);
      Sentry.captureException(new Error(message));
    });
  }

  public initialized(): boolean {
    return Sentry.getClient() !== null;
  }
}
