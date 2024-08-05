export const errorInfo = {
  // http standard
  internalServerError: { name: 'Internal Server Error', status: 500 },
  methodNotAllowed: { name: 'Method Not Allowed', status: 405 },
  notFound: { name: 'Not Found', status: 404 },
  forbidden: { name: 'Forbidden', status: 403 },
  unauthorized: { name: 'Unauthorized', status: 401 },
  badRequest: { name: 'Bad Request', status: 400 },
  // application defined
  endpointNotFound: { name: 'Endpoint Not Found', status: 404 },
  accountNotFound: { name: 'Account Not Found', status: 404 },
  userNotFound: { name: 'User Not Found', status: 404 },
} satisfies Record<string, { name: string, status: number }>;

export type ErrorCode = keyof typeof errorInfo;

export interface IServiceError {
  errorCode?: ErrorCode;
  name: string;
  status: number;
}

export class ServiceError extends Error implements IServiceError {
  constructor(
    name: string,
    public status: number,
    public errorCode?: ErrorCode,
  ) {
    super(name);
  }

  create(errorCode: ErrorCode) {
    const error = errorInfo[errorCode];
    return new ServiceError(error.name, error.status, errorCode);
  }

  createCustom(info: { name: string, status: number }) {
    return new ServiceError(info.name, info.status);
  }
}
