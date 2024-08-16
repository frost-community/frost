import * as openapiTypes from "express-openapi-validator/dist/framework/types";

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
  // openapi error
  if (err instanceof openapiTypes.HttpError) {
    if (err instanceof openapiTypes.BadRequest) {
      return {
        error: new InvalidParam(err.errors),
      };
    }
    // if (err instanceof openapiTypes.Unauthorized) {
    //   return {
    //     error: new NeedAuthentication(),
    //   };
    // }
    // if (err instanceof openapiTypes.Forbidden) {
    //   return {
    //     error: new AccessDenied(),
    //   };
    // }
    if (err instanceof openapiTypes.NotFound) {
      return {
        error: new EndpointNotFound(),
      };
    }
    if (err instanceof openapiTypes.MethodNotAllowed) {
      return {
        error: new MethodNotAllowed(),
      };
    }
  }

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

export class InvalidParam implements ErrorObject {
  code = 'invalidParam';
  message = 'One or more of the parameters are invalid.';
  status = 400;
  details: openapiTypes.ValidationErrorItem[];

  constructor(
    details: openapiTypes.ValidationErrorItem[],
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

export class AccountNotFound implements ErrorObject {
  code = 'accountNotFound';
  message = 'The specified account was not found.';
  status = 404;
  condition: {
    accountId?: string,
    name?: string,
  };

  constructor(
    condition: AccountNotFound['condition'],
  ) {
    this.condition = condition;
  }
}

export class ResourceNotFound implements ErrorObject {
  code = 'resourceNotFound';
  message = 'The specified resource was not found.';
  status = 404;
}

export class UserNotFound implements ErrorObject {
  code = 'userNotFound';
  message = 'The specified user was not found.';
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
