export type ErrorCode =
  | 'internalServerError'
  | 'endpointNotFound'
  | 'userNotFound'
  | 'accountNotFound';

const errorInfo: Record<ErrorCode, { name: string, status: number }> = {
  internalServerError: { name: 'Internal Server Error', status: 500 },
  endpointNotFound: { name: 'Endpoint Not Found', status: 404 },
  accountNotFound: { name: 'Account Not Found', status: 404 },
  userNotFound: { name: 'User Not Found', status: 404 },
};

export interface IServiceError {
  errorCode?: ErrorCode;
  name: string;
  status: number;
}

export class ServiceError extends Error {
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
