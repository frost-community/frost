import { ComponentEngine, IComponentEngineOptions } from '@frost/component';
import frostApi, { IApiOptions } from '@frost/component-api';
import frostWeb, { IWebOptions } from '@frost/component-webapp';
import IConfig from './IConfig';
import verifyConfig from './modules/verifyConfig';

async function entryPoint() {

	console.log('===========');
	console.log('  * Frost  ');
	console.log('===========');

	const config: IConfig = require('../.configs/config.json');
	verifyConfig(config);

	const engineOptions: IComponentEngineOptions = {
	};
	const engine = new ComponentEngine(config.server.httpPort, config.server.mongo, engineOptions);

	if (config.api.enable) {
		console.log('enable API component');
		const apiOptions: IApiOptions = {};
		engine.use(frostApi(apiOptions));
	}

	if (config.webapp.enable) {
		console.log('enable WebApp component');
		const webOptions: IWebOptions = {};
		engine.use(frostWeb(webOptions));
	}

	console.log('starting server...');
	await engine.start();
}

entryPoint()
.catch(err => {
	console.log(err);
});
