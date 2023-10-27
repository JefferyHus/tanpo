export interface ILogger {
  log(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  warn(message: string, context?: string): void;
  debug?(message: string, context?: string): void;
  verbose?(message: string, context?: string): void;
  silly?(message: string, context?: string): void;
}
