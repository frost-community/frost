//import { promisify } from 'util';
//import path from 'path';
//import glob from 'glob';
import Express from 'express';
import bodyParser from 'body-parser';
import { IComponent, IComponentInstallApi, IComponentBootApi, getDataVersionState, DataVersionState, ActiveConfigManager } from 'frost-core';
//import { IEndpoint, registerEndpoint } from './modules/endpoint';
import { ApiErrorSources } from './modules/apiResponse/apiError';
import ApiResponseManager from './modules/apiResponse/ApiResponseManager';
import { loadBaseConfig } from './modules/baseConfig';
//import accessTokenStrategy from './modules/accessTokenStrategy';
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
		const activeConfigManager = new ActiveConfigManager(ctx.db);

		// * data version

		log('checking dataVersion ...');
		const dataVersionState = await getDataVersionState(activeConfigManager, meta.dataVersion, this.name);
		if (dataVersionState != DataVersionState.ready) {
			if (dataVersionState == DataVersionState.needInitialization) {
				log('please initialize in setup mode.');
			}
			else if (dataVersionState == DataVersionState.needMigration) {
				log('migration is required. please migrate database in setup mode.');
			}
			else {
				log('this dataVersion is not supported. there is a possibility it was used by a newer base component. please clear database and restart.');
			}
			throw new Error('failed to boot the base component');
		}

		// * load config

		const config = await loadBaseConfig(activeConfigManager);

		const app = Express();
		//app.set('views', '');
		//app.set('view engine', 'pug');

		const bootApi = new BaseApi(app);

		bootApi.http.registerPreprocessMiddleware();
		bootApi.http.registerErrorMiddleware();

		bootApi.http.addPreprocessHandler({ }, bodyParser.json());

		// // * strategy

		// accessTokenStrategy(ctx.db);

		// // * routings

		// const endpointPaths = await promisify(glob)('**/*.js', {
		// 	cwd: path.resolve(__dirname, 'endpoints')
		// });

		// for (let endpointPath of endpointPaths) {
		// 	endpointPath = endpointPath.replace('.js', '');
		// 	const endpoint: IEndpoint = require(`./endpoints/${endpointPath}`).default;

		// 	registerEndpoint(endpoint, endpointPath, initMiddlewares, bootApi, ctx.db, activeConfigManager);
		// }

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

		app.listen(3000, () => {
			console.log('server is started on port 3000');
		});

		return bootApi;
	}
}

export default () => new BaseComponent();

export {
	IBaseApi,
	IHttpApi
};
