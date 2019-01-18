/// <reference path="./externalTypes/uid2.d.ts" />

import { promisify } from 'util'
import path from 'path';
import glob from 'glob';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { ComponentApi, IComponent, ConsoleMenu } from 'frost-component';
import { IEndpoint, ApiErrorSources, registerEndpoint } from './modules/endpoint';
import ApiResponseManager from './modules/apiResponse/ApiResponseManager';
import IApiConfig from './modules/IApiConfig';
import verifyApiConfig from './modules/verifyApiConfig';
import accessTokenStrategy from './modules/accessTokenStrategy';
import { DataFormatState } from './modules/getDataFormatState';

export {
	IApiConfig
};

export interface IApiOptions {
}

export default (config: IApiConfig, options?: IApiOptions): IComponent => {
	verifyApiConfig(config);

	// * setup menu

	let dataFormatState: DataFormatState = DataFormatState.ready;
	const menu = new ConsoleMenu('API Setup Menu');
	menu.add('exit setup', () => true, (ctx) => {
		// TODO
		ctx.closeMenu();
	});
	menu.add('initialize (register root application and root user)', () => true, (ctx) => {
		// TODO
		ctx.closeMenu();
	});
	menu.add('generate or get token for authorization host', () => (dataFormatState == DataFormatState.ready), (ctx) => {
		// TODO
		ctx.closeMenu();
	});
	menu.add('migrate from old data formats', () => (dataFormatState == DataFormatState.needMigration), (ctx) => {
		// TODO
		ctx.closeMenu();
	});

	async function handler(componentApi: ComponentApi) {

		// * strategy

		accessTokenStrategy(componentApi.db);

		// * enumerate endpoints

		// get file paths of endpoint
		const endpointPaths = await promisify(glob)('**/*.js', {
			cwd: path.resolve(__dirname, 'endpoints')
		});

		// * initialize http server

		componentApi.http.addInit((app) => {
			app.use('/api', bodyParser.json());
		});

		// * routings

		for (let endpointPath of endpointPaths) {
			endpointPath = endpointPath.replace('.js', '');
			const endpoint: IEndpoint = require(`./endpoints/${endpointPath}`).default;
			registerEndpoint(endpoint, endpointPath, componentApi, config);
		}

		componentApi.http.addRoute((app) => {
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
		handler: handler,
		setupMenu: menu
	};
};
