import { promisify } from 'util'
import path from 'path';
import glob from 'glob';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { ComponentApi, IComponent } from 'frost-component';
import { MongoProvider, ConfigManager } from 'frost-core';
import { IEndpoint, ApiErrorSources, registerEndpoint } from './modules/endpoint';
import ApiResponseManager from './modules/apiResponse/ApiResponseManager';
import IApiConfig from './modules/IApiConfig';
import verifyApiConfig from './modules/verifyApiConfig';
import accessTokenStrategy from './modules/accessTokenStrategy';
import buildHttpResResolver from './modules/apiResponse/buildHttpResResolver';
import setupMenu from './modules/setup/setupMenu';
import getDataFormatState, { DataFormatState } from './modules/getDataFormatState';
import log from './modules/log';

const meta = {
	currentDataVersion: 2
};

export {
	IApiConfig
};

export interface IApiOptions {
}

export default (options?: IApiOptions): IComponent => {
	async function init(manager: { db: MongoProvider }) {

		// * setup menu

		const menu = await setupMenu(manager.db, meta.currentDataVersion);

		return {
			setupMenu: menu
		};
	}

	// * middlewares

	const initMiddlewares = [
		bodyParser.json()
	];

	async function handler(componentApi: ComponentApi) {

		// * data format

		log('checking dataFormat ...');
		const dataFormatState: DataFormatState = await getDataFormatState(componentApi.db, meta.currentDataVersion);
		if (dataFormatState != DataFormatState.ready) {
			if (dataFormatState == DataFormatState.needInitialization) {
				log('please initialize in setup mode.');
			}
			else if (dataFormatState == DataFormatState.needMigration) {
				log('migration is required. please migrate database in setup mode.');
			}
			else {
				log('this format is not supported. there is a possibility it was used by a newer api component. please clear database and restart.');
			}
			throw new Error('failed to start api');
		}

		// * verify config

		const configManager = new ConfigManager(componentApi.db);

		const config: IApiConfig = {
			appSecretKey: await configManager.getItem('api', 'appSecretKey'),
			hostToken: {
				scopes: await configManager.getItem('api', 'hostToken.scopes')
			}
		};
		verifyApiConfig(config);

		// * strategy

		accessTokenStrategy(componentApi.db);

		// * routings

		const endpointPaths = await promisify(glob)('**/*.js', {
			cwd: path.resolve(__dirname, 'endpoints')
		});

		for (let endpointPath of endpointPaths) {
			endpointPath = endpointPath.replace('.js', '');
			const endpoint: IEndpoint = require(`./endpoints/${endpointPath}`).default;
			registerEndpoint(endpoint, endpointPath, initMiddlewares, componentApi, configManager);
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
