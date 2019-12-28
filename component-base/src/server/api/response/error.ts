export interface IApiErrorSource {
	reason: string;
	message: string;
	httpStatusCode: number;
}

export class ApiErrorSources {
	static serverError: IApiErrorSource = { reason: 'server_error', message: 'an internal error occurred on the server', httpStatusCode: 500 };
	static endpointNotFound: IApiErrorSource = { reason: 'endpoint_not_found', message: 'please check the URL you entered', httpStatusCode: 404 };
	static userNotFound: IApiErrorSource = { reason: 'user_not_found', message: 'user not found match to specified condition', httpStatusCode: 400 };
	static postingNotFound: IApiErrorSource = { reason: 'posting_not_found', message: 'posting not found match to specified condition', httpStatusCode: 400 };
	static appNotFound: IApiErrorSource = { reason: 'app_not_found', message: 'application not found match to specified condition', httpStatusCode: 400 };
	static tokenNotFound: IApiErrorSource = { reason: 'token_not_found', message: 'token not found match to specified condition', httpStatusCode: 400 };
	static nonAuthorized: IApiErrorSource = { reason: 'non_authorized', message: 'authorization is required for this endpoint', httpStatusCode: 403 };
	static missingScope: IApiErrorSource = { reason: 'missing_scope', message: 'your AccessToken does not have some scopes', httpStatusCode: 403 };
	static missingParam: IApiErrorSource = { reason: 'missing_param', message: 'some required parameters are missing', httpStatusCode: 400 };
	static invalidParamFormat: IApiErrorSource = { reason: 'invalid_param_format', message: 'some parameters are invalid format', httpStatusCode: 400 };
	static invalidJson: IApiErrorSource = { reason: 'invalid_json', message: 'request body is invalid json', httpStatusCode: 400 };
	static invalidSearchCondition: IApiErrorSource = { reason: 'invalid_search_condition', message: 'the specified condition is invalid', httpStatusCode: 400 };
	static cannotSpecifyMyself: IApiErrorSource = { reason: 'cannot_specify_myself', message: 'cannot specify myself user id', httpStatusCode: 400 };
	static cannotSpecifySameUser: IApiErrorSource = { reason: 'cannot_specify_same_user', message: 'cannot specify same user id for source and target', httpStatusCode: 400 };
	static invalidSomeScopes: IApiErrorSource = { reason: 'invalid_some_scopes', message: 'some scopes are invalid or do not have', httpStatusCode: 400 };

	// specific of user api
	static duplicatedScreenName: IApiErrorSource = { reason: 'duplicated_screen_name', message: 'The ScreenName is already exists', httpStatusCode: 400 };

	// specific of app api
	static duplicatedAppName: IApiErrorSource = { reason: 'duplicated_app_name', message: 'The app name is already exists', httpStatusCode: 400 };
	static cannnotCreateRootAppSecret: IApiErrorSource = { reason: 'cannnot_create_root_app_secret', message: 'cannot create AppSecret of root app', httpStatusCode: 400 };
	static appSecretNotCreated: IApiErrorSource = { reason: 'app_secret_not_created', message: 'the AppSecret has not been created yet', httpStatusCode: 400 };

	// specific of token
	static tokenAlreadyExists: IApiErrorSource = { reason: 'token_already_exist', message: 'the token already exists', httpStatusCode: 400 };
}

export interface IApiError {
	error: {
		reason: string;
		message: string;
		detail?: {[x: string]: any};
	};
}

export class ApiErrorUtil {
	static build(errorSource: IApiErrorSource, detail?: {[x: string]: any}): IApiError {
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
