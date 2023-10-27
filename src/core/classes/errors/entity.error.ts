import { HTTP_STATUS_CODES } from '@/constants';
import { BaseError } from './base.error';

export class EntityBaseError extends BaseError {
  constructor(message: string, status: number, public readonly entity: string) {
    super(message, status);
  }
}

export class EntityNotCreatedError extends EntityBaseError {
  constructor(message: string, public readonly entity: string) {
    super(message, HTTP_STATUS_CODES.BAD_REQUEST, entity);
  }
}

export class EntityNotUpdatedError extends EntityBaseError {
  constructor(message: string, public readonly entity: string) {
    super(message, HTTP_STATUS_CODES.BAD_REQUEST, entity);
  }
}

export class EntityNotDeletedError extends EntityBaseError {
  constructor(message: string, public readonly entity: string) {
    super(message, HTTP_STATUS_CODES.BAD_REQUEST, entity);
  }
}

export class EntityNotFoundError extends EntityBaseError {
  constructor(message: string, public readonly entity: string) {
    super(message, HTTP_STATUS_CODES.NOT_FOUND, entity);
  }
}

export class EntityAlreadyExistsError extends EntityBaseError {
  constructor(message: string, public readonly entity: string) {
    super(message, HTTP_STATUS_CODES.CONFLICT, entity);
  }
}

export class InvalidEntityPropertyError extends BaseError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODES.NOT_ACCEPTABLE);
  }
}

export class InvalidEntityPropertyStateError extends BaseError {
  constructor(message: string) {
    super(message, HTTP_STATUS_CODES.CONFLICT);
  }
}
