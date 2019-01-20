/// <reference path="../externalTypes/uid2.d.ts" />

import { promisify } from 'util'
import path from 'path';
import glob from 'glob';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { ComponentApi, IComponent, ConsoleMenu, MongoProvider } from 'frost-component';
import { IEndpoint, ApiErrorSources, registerEndpoint } from './modules/endpoint';
import ApiResponseManager from './modules/apiResponse/ApiResponseManager';
import IApiConfig from './modules/IApiConfig';
import verifyApiConfig from './modules/verifyApiConfig';
import accessTokenStrategy from './modules/accessTokenStrategy';
import { DataFormatState } from './modules/getDataFormatState';
import buildHttpResResolver from './modules/apiResponse/buildHttpResResolver';

export {
	IApiConfig
};

export interface IApiOptions {
}

export default (config: IApiConfig, options?: IApiOptions): IComponent => {
	verifyApiConfig(config);

	function init(manager: { db: MongoProvider }) {

		// * setup menu

		let dataFormatState: DataFormatState = DataFormatState.ready;
		const menu = new ConsoleMenu('API Setup Menu');
		menu.add('exit setup', () => true, (ctx) => {
			ctx.closeMenu();
		});
		menu.add('initialize (register root app and root user)', () => true, (ctx) => {
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

		return {
			setupMenu: menu
		};
	}

	async function handler(componentApi: ComponentApi) {

		// * strategy

		accessTokenStrategy(componentApi.db);

		// * initialize http server

		componentApi.http.addInit((app) => {
			app.use('/api', bodyParser.json());
		});

		// * routings

		const endpointPaths = await promisify(glob)('**/*.js', {
			cwd: path.resolve(__dirname, 'endpoints')
		});

		for (let endpointPath of endpointPaths) {
			endpointPath = endpointPath.replace('.js', '');
			const endpoint: IEndpoint = require(`./endpoints/${endpointPath}`).default;
			registerEndpoint(endpoint, endpointPath, componentApi, config);
		}

		componentApi.http.addRoute((app) => {

			// endpoint not found
			app.use('/api', async (req, res) => {
				const apiRes = new ApiResponseManager(buildHttpResResolver(res));
				await apiRes.error(ApiErrorSources.endpointNotFound);
			});

			// error handling
			app.use('/api', (err: any, req: Request, res: Response, next: NextFunction) => {
				const apiRes = new ApiResponseManager(buildHttpResResolver(res));

				// authentication error
				if (err.name == 'AuthenticationError') {
					apiRes.error(ApiErrorSources.nonAuthorized);
					return;
				}

				// json parsing error
				if (err instanceof SyntaxError && err.message.indexOf('JSON') != -1) {
					apiRes.error(ApiErrorSources.invalidJson);
					return;
				}

				// server error
				console.error('Server error:');
				console.error(err);
				apiRes.error(ApiErrorSources.serverError);
			});

		});
	}

	return {
		name: 'api',
		init: init,
		handler: handler
	};
};
