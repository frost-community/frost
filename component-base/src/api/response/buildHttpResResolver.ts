import Express from 'express';
import { IApiResponseSource } from 'local/src/api/response/responseManager';
import { ApiErrorUtil } from 'local/src/api/response/error';

export default (res: Express.Response) => {
	return (source: IApiResponseSource) => {
		if (source.resultData != null) {
			res.status(200).json(source.resultData);
		}
		else if (source.errorSource != null) {
			const statusCode = source.errorSource.httpStatusCode;
			res.status(statusCode).json(ApiErrorUtil.build(source.errorSource, source.errorDetail));
		}
	};
};
