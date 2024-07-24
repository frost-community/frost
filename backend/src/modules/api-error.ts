type ErrorCode =
  | 'internalServerError'
  | 'endpointNotFound'
  | 'userNotFound'
  | 'accountNotFound';

type ErrorInfo = {
  status: number,
  message: (...args: any[]) => string,
};

const errorInfos = new Map<ErrorCode, ErrorInfo>();
errorInfos.set('internalServerError', { status: 500, message: () => 'internal server error' });
errorInfos.set('endpointNotFound', { status: 404, message: () => 'endpoint not found' });
errorInfos.set('userNotFound', { status: 404, message: () => 'user not found' });
errorInfos.set('accountNotFound', { status: 404, message: () => 'account not found' });

export type ApiErrorItem = {
  code: ErrorCode,
  message: string,
};

export type ApiError = {
  status: number,
  message: string,
  errors: ApiErrorItem[],
};

export class ApiErrorContext {
  errorCodes: ErrorCode[] = [];
  constructor() {}

  build() {
    for (const errorCode of this.errorCodes) {
      const info = errorInfos.get(errorCode);
      if (info == null) {
        console.error('unknown error code: ' + errorCode);
        this.errorCodes.push('internalServerError');
        continue;
      }
      //info;
    }
  }
}

export function apiError(errorCode: ErrorCode, details: any = undefined): ApiError {
  const info = errorInfos.get(errorCode);
  if (info == null) {
    throw new Error('error info not exists:' + errorCode);
  }
  return {
    status: info.status,
    errors: [
      { code: errorCode, message: info.message() },
    ],
    message: info.message(),
  };
}
