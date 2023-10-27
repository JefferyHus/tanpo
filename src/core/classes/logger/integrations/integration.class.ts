import { LogLevels } from '@/core/classes/logger/logger.types';

export class Integration {
  public options: unknown;

  constructor(options: unknown) {
    this.setup(options);
  }

  public setup<T>(options?: T): void {
    this.options = options;
  }

  public log(
    level: LogLevels,
    error: string,
    context?: Record<string, unknown>,
  ): void {
    throw new Error('Method not implemented.', {
      cause: {
        level,
        context,
      },
    });
  }
}
