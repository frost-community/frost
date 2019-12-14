//import { promisify } from 'util';
//import path from 'path';
//import glob from 'glob';
import Express from 'express';
import bodyParser from 'body-parser';
import { IComponent, IComponentInstallApi, IComponentBootApi, getDataVersionState, DataVersionState, ActiveConfigManager } from 'frost-core';
//import accessTokenStrategy from '@/api/misc/accessTokenStrategy';
import { IBaseApi, IHttpApi, BaseApi, HttpMethod } from './baseApi';

import { IEndpoint, registerEndpoint } from './api/routing/endpoint';
import { ApiErrorSources } from './api/response/error';
import ApiResponseManager from './api/response/responseManager';
import { loadBaseConfig } from './misc/baseConfig';
import buildHttpResResolver from './api/response/buildHttpResResolver';
import setupMenu from './misc/setup/setupMenu';
import log from './misc/log';

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
		app.disable('x-powered-by');
		//app.set('views', '');
		//app.set('view engine', 'pug');

		const bootApi = new BaseApi(app);

		bootApi.http.preprocess({ }, bodyParser.json());

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
		bootApi.http.postprocess({ path: '/api' }, async (req, res) => {
			const apiRes = new ApiResponseManager(buildHttpResResolver(res));
			await apiRes.error(ApiErrorSources.endpointNotFound);
		});

		// endpoint not found
		bootApi.http.postprocess({ }, async (req, res) => {
			res.status(404).send('pageNotFound');
		});

		// api error handling
		bootApi.http.error({ path: '/api' }, (err, req, res, next) => {
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

		// general error handling
		bootApi.http.error({ }, (err, req, res, next) => {
			// server error
			console.error('Server error:');
			console.error(err);
			res.status(500).send('ServerError');
		});

		// when the all components have been started
		ctx.messenger.once('server.bootCompleted', () => {
			bootApi.http.registerPreprocesses();
			bootApi.http.registerRoutes();
			bootApi.http.registerPostprocesses();
			bootApi.http.registerErrores();

			app.listen(3000, () => {
				console.log('server is started on port 3000');
			});
		});

		return bootApi;
	}
}

export default () => new BaseComponent();

export {
	IBaseApi,
	IHttpApi
};
