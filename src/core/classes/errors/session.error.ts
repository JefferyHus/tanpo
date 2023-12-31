import { HTTP_STATUS_CODES } from '@/constants';

import { BaseError } from './base.error';

export class SessionBaseError extends BaseError {
  constructor(message: string, status: number) {
    super(message, status);
  }
}

export class SessionExpiredError extends SessionBaseError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODES.GONE);
  }
}

export class SessionNotFoundError extends SessionBaseError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODES.NOT_FOUND);
  }
}
