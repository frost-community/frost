/// <reference path="./externalTypes/uid2.d.ts" />

import { promisify } from 'util'
import path from 'path';
import glob from 'glob';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { ComponentEngineManager, IComponent } from 'frost-component';
import { IEndpoint, ApiErrorSources, registerEndpoint } from './modules/endpoint';
import ApiResponseManager from './modules/apiResponse/ApiResponseManager';
import IApiConfig from './modules/IApiConfig';
import verifyApiConfig from './modules/verifyApiConfig';
import accessTokenStrategy from './modules/accessTokenStrategy';

export {
	IApiConfig
};

export interface IApiOptions {
}

export default (config: IApiConfig, options?: IApiOptions): IComponent => {
	verifyApiConfig(config);

	async function handler(manager: ComponentEngineManager) {
		accessTokenStrategy(manager.db);

		// get file paths of endpoint
		const endpointPaths = await promisify(glob)('**/*.js', {
			cwd: path.resolve(__dirname, 'endpoints')
		});

		manager.http.addInit((app) => {
			app.use('/api', bodyParser.json());
		});

		for (let endpointPath of endpointPaths) {
			endpointPath = endpointPath.replace('.js', '');
			const endpoint: IEndpoint = require(`./endpoints/${endpointPath}`).default;
			registerEndpoint(endpoint, endpointPath, manager, config);
		}

		manager.http.addRoute((app) => {
			app.use('/api', (req, res) => {
				const apiRes = new ApiResponseManager();
				apiRes.error(ApiErrorSources.endpointNotFound);
				apiRes.transport(res);
			});

			app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {

				if (err.name == 'AuthenticationError') {
					const apiRes = new ApiResponseManager();
					apiRes.error(ApiErrorSources.nonAuthorized);
					apiRes.transport(res);
					return;
				}

				next(err);
			});

			// json parsing error handler
			app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {

				if (err instanceof SyntaxError && err.message.indexOf('JSON') != -1) {
					const apiRes = new ApiResponseManager();
					apiRes.error(ApiErrorSources.invalidJson);
					apiRes.transport(res);
					return;
				}

				next(err);
			});

			// server error handler
			app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {
				console.error('Server error:');
				console.error(err);

				const apiRes = new ApiResponseManager();
				apiRes.error(ApiErrorSources.serverError);
				apiRes.transport(res);
			});
		});
	}

	return {
		name: 'api',
		handler: handler
	};
};
