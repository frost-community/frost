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
	static InvalidParamFormat: IApiErrorSource = { reason: 'invalid_param_format', message: 'some parameters are invalid format', httpStatusCode: 400 };
	static InvalidJson: IApiErrorSource = { reason: 'invalid_json', message: 'request body is invalid json', httpStatusCode: 400 };
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
