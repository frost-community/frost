import { ValidationErrorItem } from "express-openapi-validator/dist/framework/types";

export interface ErrorObject {
  code: string,
  message: string,
  status: number,
}

export class AppError extends Error {
  constructor(
    public error: ErrorObject,
  ) {
    super(error.message);
  }
}

export function createError(error: ErrorObject): AppError {
  return new AppError(error);
}

/**
 * 任意のエラー情報を元にREST APIのエラーを組み立てます。
*/
export function buildRestApiError(err: unknown): { error: ErrorObject } {
  // TODO: handle errors
  // - app error
  // - openapi validation error
  // - server internal error
  throw new Error('not implemented');
}

export class InvalidParamError extends Error implements ErrorObject {
  code = 'invalidParam';
  message = 'Invalid Paramer';
  status = 400;
  details: ValidationErrorItem[];

  constructor(
    details: ValidationErrorItem[],
  ) {
    super('Invalid Parameter');
    this.details = details;
  }
}

export class NeedAuthentication implements ErrorObject {
  code = 'needAuthentication';
  message = 'Need Authentication';
  status = 401;
}

export class AccessDenied implements ErrorObject {
  code = 'accessDenied';
  message = 'Access Denied';
  status = 403;
}

export class AccountNotFound implements ErrorObject {
  code = 'accountNotFound';
  message = 'Account Not Found';
  status = 404;
  condition: {
    accountId?: string,
    email?: string,
  };

  constructor(
    condition: AccountNotFound['condition'],
  ) {
    this.condition = condition;
  }
}

export class UserNotFound implements ErrorObject {
  code = 'userNotFound';
  message = 'User Not Found';
  status = 404;
  condition: {
    userId?: string,
    userName?: string,
  };

  constructor(
    condition: UserNotFound['condition'],
  ) {
    this.condition = condition;
  }
}

export class EndpointNotFound implements ErrorObject {
  code = 'endpointNotFound';
  message = 'Endpoint Not Found';
  status = 404;
  path: string;

  constructor(
    path: string,
  ) {
    this.path = path;
  }
}

export class MethodNotAllowed implements ErrorObject {
  code = 'methodNotAllowed';
  message = 'Method Not Allowed';
  status = 405;
  path: string;

  constructor(
    path: string,
  ) {
    this.path = path;
  }
}

export class ServerError implements ErrorObject {
  code = 'serverError';
  message = 'Server Error';
  status = 500;
}
