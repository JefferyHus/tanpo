import { HTTP_STATUS_CODES } from '@/constants';

import { BaseError } from './base.error';

export type ErrorConextData = {
  [key: string]: string | number | boolean | null | undefined;
};

export class HttpBaseError extends BaseError {
  public data: ErrorConextData | undefined;

  constructor(message: string, status: number, data?: ErrorConextData) {
    super(message, status);

    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export class HttpInterceptorError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, data);
  }
}

export class HttpNotFoundError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.NOT_FOUND, data);
  }
}

export class HttpBadRequestError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.BAD_REQUEST, data);
  }
}

export class HttpUnauthorizedError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.UNAUTHORIZED, data);
  }
}

export class HttpForbiddenError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.FORBIDDEN, data);
  }
}

export class HttpConflictError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.CONFLICT, data);
  }
}

export class HttpInternalServerError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, data);
  }
}

export class HttpNotImplementedError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.NOT_IMPLEMENTED, data);
  }
}

export class HttpBadGatewayError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.BAD_GATEWAY, data);
  }
}

export class HttpServiceUnavailableError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.SERVICE_UNAVAILABLE, data);
  }
}

export class HttpGatewayTimeoutError extends HttpBaseError {
  constructor(message: string, data?: ErrorConextData) {
    super(message, HTTP_STATUS_CODES.GATEWAY_TIMEOUT, data);
  }
}
