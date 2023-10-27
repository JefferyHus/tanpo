export type LogLevels =
  | 'fatal'
  | 'error'
  | 'warn'
  | 'warning'
  | 'log'
  | 'info'
  | 'debug'
  | 'trace'
  | 'silent'
  | 'silly'
  | 'http';

export enum LogLevelsEnum {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  WARNING = 'warning',
  LOG = 'log',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
  SILENT = 'silent',
  SILLY = 'silly',
  HTTP = 'http',
}

export enum DebugModes {
  SENTRY = 'sentry:*',
  SERVER = 'server:*',
  BOTH = '*',
}
