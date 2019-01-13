import Express from 'express';
import { IResponseObject, MessageResponseObject } from './responseObjects';
import { ApiErrorUtil, ApiErrorSources, IApiErrorSource } from './apiError';

export default class ApiResponseManager {
	resultData?: IResponseObject<any>;
	errorSource?: IApiErrorSource;
	errorDetail?: { [x: string]: any }

	get responded(): boolean {
		return (this.resultData != null || this.errorSource != null);
	}

	ok(data: string | IResponseObject<any>): void {
		if (this.responded) {
			throw new Error('already responded');
		}

		if (typeof data == 'string') {
			this.resultData = new MessageResponseObject(data);
		}
		else {
			this.resultData = data;
		}
	}

	error(errorSource: IApiErrorSource, errorDetail?: { [x: string]: any }): void {
		if (this.responded) {
			throw new Error('already responded');
		}

		this.errorSource = errorSource;
		this.errorDetail = errorDetail;
	}

	transport(res: Express.Response): void {
		if (!this.responded) {
			console.log('no response');
			this.error(ApiErrorSources.serverError);
		}

		if (this.resultData != null) {
			res.status(200).json(this.resultData);
		}
		else if (this.errorSource != null) {
			const statusCode = this.errorSource.httpStatusCode;
			res.status(statusCode).json(ApiErrorUtil.build(this.errorSource, this.errorDetail));
		}
	}
}
