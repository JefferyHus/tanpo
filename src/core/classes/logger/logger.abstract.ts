import { ILogger } from './logger.interface';
import { LogLevels } from './logger.types';

export abstract class AbstractLogger implements ILogger {
  abstract log(level: LogLevels, message?: string): void;
  abstract error(message: string, trace?: string, context?: string): void;
  abstract warn(message: string, context?: string): void;
  abstract debug?(message: string, context?: string): void;
  abstract verbose?(message: string, context?: string): void;
  abstract silly?(message: string, context?: string): void;
}
