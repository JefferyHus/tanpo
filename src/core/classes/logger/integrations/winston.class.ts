import winston, { LoggerOptions } from 'winston';

import { LogLevels } from '@/core/classes/logger/logger.types';

import { Integration } from './integration.class';

export class WinstonIntegration extends Integration {
  private logger: winston.Logger | undefined;

  constructor(options?: LoggerOptions) {
    super(options);
    this.setup(options);
  }

  public setup<LoggerOptions>(options?: LoggerOptions): void {
    let format: winston.Logform.Format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.metadata({
        fillExcept: ['message', 'level', 'timestamp', 'label'],
      }),
      winston.format.errors({ stack: true }),
      winston.format.printf(
        (info) =>
          `${info.timestamp} [${info.level}]: ${info.message} ${JSON.stringify(
            info.metadata,
          )}`,
      ),
    );

    if (process.env.NODE_ENV === 'production') {
      format = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf((info) => {
          return JSON.stringify(info);
        }),
      );
    }

    const transports: winston.transport[] = [new winston.transports.Console()];

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL ?? 'debug',
      exitOnError: false,
      transports,
      format,
      ...options,
    });
  }

  public log(
    level: LogLevels,
    error: unknown,
    context?:
      | (Record<string, unknown> & { error?: Error })
      | string
      | Array<unknown>,
  ): void {
    if (!this.logger) {
      throw new Error('Logger not initialized');
    }

    if (typeof context === 'object' && context !== null && 'error' in context) {
      if (context.error instanceof Error) {
        context.error = {
          name: context.error.name,
          message: context.error.message,
          stack: context.error.stack,
        };
      } else {
        context.error = {
          name: 'Error',
          message: String(context.error),
          stack: undefined,
        };
      }
    }

    this.logger.log(level, String(error), context);
  }

  public initialized(): boolean {
    return this.logger !== undefined;
  }
}
