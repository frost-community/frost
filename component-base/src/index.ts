import { promisify } from 'util';
import path from 'path';
import glob from 'glob';
import Express from 'express';
import bodyParser from 'body-parser';
import { IComponent, IComponentInstallApi, IComponentBootApi, getDataVersionState, DataVersionState, ActiveConfigManager } from 'frost-core';
import { IEndpoint, ApiErrorSources, registerEndpoint } from './modules/endpoint';
import ApiResponseManager from './modules/apiResponse/ApiResponseManager';
import { IBaseConfig, isBaseConfig } from './modules/baseConfig';
import accessTokenStrategy from './modules/accessTokenStrategy';
import buildHttpResResolver from './modules/apiResponse/buildHttpResResolver';
import setupMenu from './modules/setup/setupMenu';
import log from './modules/log';
import { IBaseApi, IHttpApi, BaseApi, HttpMethod } from './baseApi';

const meta = {
	dataVersion: 1
};

class BaseComponent implements IComponent {
	name: string = 'base';
	version = { major: 1, minor: 0 };
	dependencies: string[] = [];

	async install(ctx: IComponentInstallApi): Promise<void> {

		// * setup menu

		const menu = await setupMenu(ctx.db, meta.dataVersion);

		ctx.registerSetupMenu(menu);
	}

	async boot(ctx: IComponentBootApi): Promise<IBaseApi> {

		const initMiddlewares = [
			bodyParser.json()
		];

		// * data version

		log('checking dataVersion ...');
		const dataVersionState = await getDataVersionState(ctx.db, meta.dataVersion,
			'base.config',
			['base.users', 'base.apps', 'base.tokens', 'base.userRelations', 'base.postings', 'base.storageFiles'],
			{ enableOldMetaCollection: true });
		if (dataVersionState != DataVersionState.ready) {
			if (dataVersionState == DataVersionState.needInitialization) {
				log('please initialize in setup mode.');
			}
			else if (dataVersionState == DataVersionState.needMigration) {
				log('migration is required. please migrate database in setup mode.');
			}
			else {
				log('this dataVersion is not supported. there is a possibility it was used by a newer api component. please clear database and restart.');
			}
			throw new Error('failed to start api');
		}

		// * verify config

		const activeConfigManager = new ActiveConfigManager(ctx.db);

		const config: IBaseConfig = {
			apiBaseUrl: await activeConfigManager.getItem('base', 'apiBaseUrl'),
			appSecretKey: await activeConfigManager.getItem('base', 'appSecretKey'),
			clientToken: {
				scopes: await activeConfigManager.getItem('base', 'clientToken.scopes')
			},
			hostToken: {
				scopes: await activeConfigManager.getItem('base', 'hostToken.scopes'),
				accessToken: await activeConfigManager.getItem('base', 'hostToken.accessToken')
			},
			recaptcha: {
				enable: await activeConfigManager.getItem('base', 'recaptcha.enable'),
				siteKey: await activeConfigManager.getItem('base', 'recaptcha.siteKey'),
				secretKey: await activeConfigManager.getItem('base', 'recaptcha.secretKey'),
			}
		};
		if (!isBaseConfig(config)) {
			throw TypeError('base config is invalid');
		}

		const app = Express();
		//app.set('views', '');
		//app.set('view engine', 'pug');

		const bootApi = new BaseApi(app);

		bootApi.http.registerPreprocessMiddleware();
		bootApi.http.registerErrorMiddleware();

		// * strategy

		accessTokenStrategy(ctx.db);

		// * routings

		const endpointPaths = await promisify(glob)('**/*.js', {
			cwd: path.resolve(__dirname, 'endpoints')
		});

		for (let endpointPath of endpointPaths) {
			endpointPath = endpointPath.replace('.js', '');
			const endpoint: IEndpoint = require(`./endpoints/${endpointPath}`).default;

			registerEndpoint(endpoint, endpointPath, initMiddlewares, bootApi, ctx.db, activeConfigManager);
		}

		// endpoint not found
		bootApi.http.addRoute(HttpMethod.All, '/api(/*)?', async (req, res) => {
			const apiRes = new ApiResponseManager(buildHttpResResolver(res));
			await apiRes.error(ApiErrorSources.endpointNotFound);
		});

		// error handling
		bootApi.http.addErrorHandler({ path: '/api' }, (err, req, res, next) => {
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

		return bootApi;
	}
}

export default () => new BaseComponent();

export {
	IBaseApi,
	IHttpApi
};
