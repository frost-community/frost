import bodyParser from 'body-parser';
import Express from 'express';
import { ActiveConfigManager, DataVersionState, getDataVersionState, IComponent, IComponentBootApi, IComponentInstallApi } from 'frost-core';
import { BaseApi, IBaseApi, HttpMethod } from './baseApi';
import { loadBaseConfig } from './misc/baseConfig';
import log from './misc/log';
import setupMenu from './misc/setup/setupMenu';
import apiRouting from './server/api/routing';
import backendRouting from './server/backend/routing';

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

		log('loading config ...');
		const config = await loadBaseConfig(activeConfigManager);
		if (!config) {
			throw new Error('failed to load the base config');
		}

		log('adding routes ...');
		const app = Express();
		app.disable('x-powered-by');
		//app.set('views', '');
		//app.set('view engine', 'pug');

		const bootApi = new BaseApi(app);

		bootApi.http.preprocess({ }, bodyParser.json());

		// api routing
		await apiRouting(ctx, bootApi, activeConfigManager);

		// backend routing
		await backendRouting(ctx, bootApi, activeConfigManager);

		// endpoint not found
		bootApi.http.postprocess({ }, async (req, res) => {
			res.status(404).send('NotFound');
		});

		// general error handling
		bootApi.http.error({ }, (err, req, res, next) => {
			// server error
			log('Server error:');
			log(err);
			res.status(500).send('ServerError');
		});

		// when the all components have been started
		ctx.messenger.once('server.bootCompleted', () => {
			bootApi.http.registerPreprocesses();
			bootApi.http.registerRoutes();
			bootApi.http.registerPostprocesses();
			bootApi.http.registerErrores();

			app.listen(config.httpPort, () => {
				log(`server is started on port ${config.httpPort}`);
			});
		});

		return bootApi;
	}
}

export default () => new BaseComponent();

export {
	IBaseApi,
	HttpMethod
};
