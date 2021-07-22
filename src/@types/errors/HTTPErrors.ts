/* eslint-disable max-classes-per-file */
import { ValidationError } from 'express-validator';
import { Moment } from 'moment-timezone';

import BaseError from './BaseError';

abstract class HTTPError extends BaseError {
  constructor(
    readonly status: number,
    readonly name: string,
    readonly message: string,
    readonly payload?: unknown,
  ) {
    super(name, message, undefined, payload);
  }
}

class BadRequestError extends HTTPError {
  constructor(
    message = 'Invalid request parameters provided',
    validationErrors?: ValidationError[],
  ) {
    super(400, 'Bad Request', message, validationErrors);
  }
}

class UnauthorizedError extends HTTPError {
  constructor(
    message = 'Request does not contain a valid access token',
    payload?: unknown,
  ) {
    super(401, 'Unauthorized', message, payload);
  }
}

class ForbiddenError extends HTTPError {
  constructor(message = 'User does not have privilege to access resource') {
    super(403, 'Forbidden', message);
  }
}

class NotFoundError extends HTTPError {
  constructor(message = 'Resource not found') {
    super(404, 'Not Found', message);
  }
}

class MethodNotAllowedError extends HTTPError {
  constructor(message = 'Endpoint not found') {
    super(405, 'Method Not Allowed', message);
  }
}

class ConflictError extends HTTPError {
  constructor(message = 'Request conflicts') {
    super(409, 'Conflict Error', message);
  }
}

class UnprocessableEntityError extends HTTPError {
  constructor(message = 'Request parameters are valid but are unprocessable') {
    super(422, 'Unprocessable Entity', message);
  }
}

class TooManyRequestsError extends HTTPError {
  constructor(
    message = 'Request reached limit',
    nextValidRequestDate?: Moment,
  ) {
    super(429, 'Too Many Requests', message, { nextValidRequestDate });
  }
}

class InternalServerError extends HTTPError {
  constructor(message = 'Something went wrong') {
    super(500, 'Internal Server Error', message);
  }
}

class ServiceUnavailableError extends HTTPError {
  constructor(message = 'Service is currently unavailable') {
    super(503, 'Service Unavailable', message);
  }
}

export default HTTPError;
export {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  ConflictError,
  UnprocessableEntityError,
  TooManyRequestsError,
  InternalServerError,
  ServiceUnavailableError,
};
