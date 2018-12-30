import Express from 'express';

// general

export class ApiResponseManager {
	resultData?: IApiResult;
	errorSource?: IApiErrorSource;

	get responded(): boolean {
		return (this.resultData != null || this.errorSource != null);
	}

	ok(data: string | IApiResult): void {
		if (this.responded) {
			throw new Error('already responded');
		}

		if (typeof data == 'string') {
			this.resultData = { resultType: ApiResultType.Message, result: data };
		}
		else {
			this.resultData = data;
		}
	}

	error(errorSource: IApiErrorSource): void {
		if (this.responded) {
			throw new Error('already responded');
		}

		this.errorSource = errorSource;
	}

	respond(res: Express.Response): void {
		if (!this.responded) {
			console.log('no response');
			this.error(ApiErrorSources.ServerError);
		}

		if (this.resultData != null) {
			res.status(200).json(this.resultData);
		}
		else if (this.errorSource != null) {
			const statusCode = this.errorSource.httpStatusCode;
			res.status(statusCode).json(ApiErrorUtil.build(this.errorSource));
		}
	}
}

// api result

export enum ApiResultType {
	User = 'user',
	Message = 'message',
}

export interface IApiResult {
	resultType: ApiResultType;
	result: any;
}

// api error

export interface IApiErrorSource {
	reason: string;
	message: string;
	httpStatusCode: number;
}

export class ApiErrorSources {
	static ServerError: IApiErrorSource = { reason: 'server_error', message: 'an internal error occurred on the server', httpStatusCode: 500 };
	static EndpointNotFound: IApiErrorSource = { reason: 'endpoint_not_found', message: 'please check the URL you entered', httpStatusCode: 404 };
	static UserNotFound: IApiErrorSource = { reason: 'user_not_found', message: '', httpStatusCode: 404 };
	static PostingNotFound: IApiErrorSource = { reason: 'posting_not_found', message: '', httpStatusCode: 404 };
	static AppNotFound: IApiErrorSource = { reason: 'app_not_found', message: '', httpStatusCode: 404 };
	static NonAuthorized: IApiErrorSource = { reason: 'non_authorized', message: 'authorization is required for this endpoint', httpStatusCode: 403 };
	static MissingScope: IApiErrorSource = { reason: 'missing_scope', message: 'your AccessToken does not have some scopes', httpStatusCode: 403 };
	static MissingParam: IApiErrorSource = { reason: 'missing_param', message: 'some required parameters are missing', httpStatusCode: 400 };
}

export interface IApiError {
	error: {
		reason: string;
		message: string;
		detail?: { [x: string]: any };
	};
}

export class ApiErrorUtil {
	static build(errorSource: IApiErrorSource, detail?: { [x: string]: any }): IApiError {
		const apiError: IApiError = {
			error: {
				reason: errorSource.reason,
				message: errorSource.message
			}
		};
		if (detail) {
			apiError.error.detail = detail;
		}
		return apiError;
	}
}
