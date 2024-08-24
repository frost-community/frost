import * as openapiTypes from "express-openapi-validator/dist/framework/types";

export interface ErrorObject {
  [x: string]: any,
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

export function appError(error: ErrorObject): AppError {
  return new AppError(error);
}

/**
 * 任意のエラー情報を元にREST APIのエラーを組み立てます。
*/
export function buildRestApiError(err: unknown): { error: ErrorObject } {
  // app error
  if (err instanceof AppError) {
    return {
      error: err.error,
    };
  }

  // other errors
  console.error(err);
  return {
    error: new ServerError(),
  };
}

export class BadRequest implements ErrorObject {
  code = 'badRequest';
  message = 'The request is invalid.';
  status = 400;
  details?: { code?: string, path?: (string | number)[], message: string }[];

  constructor(
    details?: BadRequest["details"],
  ) {
    this.details = details;
  }
}

export class Unauthenticated implements ErrorObject {
  code = 'unauthenticated';
  message = 'Credentials are required for access.';
  status = 401;
}

export class AccessDenied implements ErrorObject {
  code = 'accessDenied';
  message = 'You do not have access permissions.';
  status = 403;
}

export class ResourceNotFound implements ErrorObject {
  code = 'resourceNotFound';
  message = 'The specified resource was not found.';
  status = 404;

  constructor(
    public resorceName: string,
  ) {}
}

export class EndpointNotFound implements ErrorObject {
  code = 'endpointNotFound';
  message = 'The specified API endpoint was not found.';
  status = 404;
}

export class MethodNotAllowed implements ErrorObject {
  code = 'methodNotAllowed';
  message = 'This API endpoint does not support the specified operation.';
  status = 405;
}

export class ServerError implements ErrorObject {
  code = 'serverError';
  message = 'An internal error occurred on the server.';
  status = 500;
}
