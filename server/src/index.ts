import { ComponentEngine, IComponentEngineOptions } from '@frost/component';
import frostApi, { IApiOptions } from '@frost/component-api';
import frostWeb, { IWebOptions } from '@frost/component-webapp';
import IConfig from './IConfig';
const config: IConfig = require('../.configs/config.json');

console.log('===========');
console.log('  * Frost  ');
console.log('===========');

const engineOptions: IComponentEngineOptions = {
	httpPort: config.server.httpPort
};
const engine = new ComponentEngine(engineOptions);

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
engine.start()
	.catch(err => {
		console.log(err);
	});
