import { ComponentEngine, IComponentEngineOptions } from 'frost-component';
import frostApi, { IApiOptions, IApiConfig } from 'frost-component-api';
import frostWeb, { IWebOptions, IWebAppConfig } from 'frost-component-webapp';
import IServerConfig from './modules/IServerConfig';
import verifyServerConfig from './modules/verifyServerConfig';

function loadConfig(configName: string, envName: string, fileName: string): any {
	try {
		if (process.env[envName] != null) {
			console.log(`loading ${configName} config from ${envName} env variable ...`);
			return JSON.parse(process.env[envName]!);
		}
		else {
			console.log(`loading ${configName} config from ${fileName} ...`);
			return require(`../.configs/${fileName}`);
		}
	}
	catch (err) {
		throw new Error(`a valid ${configName} config not found`);
	}
}

async function entryPoint() {

	console.log('===========');
	console.log('  * Frost  ');
	console.log('===========');

	const serverConfig: IServerConfig = loadConfig('server', 'FROST_SERVER', 'server-config.json');
	verifyServerConfig(serverConfig);

	if (process.env.PORT != null) {
		serverConfig.httpPort = parseInt(process.env.PORT);
	}
	else if (serverConfig.httpPort != null) {
		serverConfig.httpPort = serverConfig.httpPort;
	}
	else {
		throw new Error('httpPort is not configured');
	}

	const engineOptions: IComponentEngineOptions = {
	};
	const engine = new ComponentEngine(serverConfig.httpPort, serverConfig.mongo, engineOptions);

	if (serverConfig.enableApi) {
		console.log('enable API component');
		const apiConfig: IApiConfig = loadConfig('api', 'FROST_API', 'api-config.json');
		engine.use(frostApi(apiConfig, { }));
	}

	if (serverConfig.enableWebApp) {
		console.log('enable WebApp component');
		const webappConfig: IWebAppConfig = loadConfig('webapp', 'FROST_WEBAPP', 'webapp-config.json');
		engine.use(frostWeb(webappConfig, { }));
	}

	console.log('starting server ...');
	await engine.start();
}

entryPoint()
.catch(err => {
	console.log(err);
});
