import $ from 'cafy';
import argv from 'argv';
import { ComponentEngine, IComponentEngineOptions } from 'frost-component';
import frostApi, { IApiOptions } from 'frost-component-api';
import frostWeb, { IWebOptions } from 'frost-component-webapp';
import { CoreConfigManager, MongoProvider, ICoreConfig, ConfigManager, ConsoleMenu, inputLine } from 'frost-core';
import IServerConfig from './modules/IServerConfig';
import verifyServerConfig from './modules/verifyServerConfig';

const question = async (str: string) => (await inputLine(str)).toLowerCase().indexOf('y') === 0;

const log = (...params: any[]) => {
	console.log('[Server]', ...params);
};

function loadConfig(configName: string, envName: string, fileName: string): any {
	try {
		if (process.env[envName] != null) {
			log(`loading ${configName} config from ${envName} env variable ...`);
			return JSON.parse(process.env[envName]!);
		}
		else {
			log(`loading ${configName} config from ${fileName} ...`);
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

	// * core config

	console.log('loading core config ...');
	let coreConfig: ICoreConfig | undefined;
	try {
		coreConfig = loadConfig('core', 'FROST_CORE', 'core-config.json') as ICoreConfig;
		CoreConfigManager.verify(coreConfig);
		console.log('loaded core config.');
	}
	catch {
		console.log('valid core config was not found.');
	}

	// * db

	let db: MongoProvider | undefined;
	let configManager: ConfigManager | undefined;
	if (coreConfig) {
		console.log('connecting db ...');
		db = await MongoProvider.connect(coreConfig.mongo.url, coreConfig.mongo.dbName);
		configManager = new ConfigManager(db);
		console.log('connected db.');
	}

	// * option args

	argv.option({
		name: 'init',
		type: 'boolean',
		description: 'Display initialization mode'
	});

	argv.option({
		name: 'setup',
		type: 'boolean',
		description: 'Display setup mode'
	});

	const { options } = argv.run();

	// * init

	if (options.init) {
		const menu = new ConsoleMenu('init');
		menu.add('close', () => true, (ctx) => {
			ctx.closeMenu();
		});
		menu.add('generate core config', () => true, async (ctx) => {
			await CoreConfigManager.showInit();
		});
		menu.add('configure server', () => (configManager != null), async (ctx) => {
			const isSetHttpPort = await question('do you set the httpPort? (y/n) > ');
			let httpPort: number | undefined = undefined;
			if (isSetHttpPort) {
				httpPort = parseInt(await inputLine('please input your httpPort > '));
				if (Number.isNaN(httpPort)) {
					console.log('httpPort is invalid value');
					return;
				}
			}
			const enableApi = await question('do you want to enable api component? (y/n) > ');
			const enableWebApp = await question('do you want to enable webapp component? (y/n) > ');

			console.log('configure server ...');
			await configManager!.setItem('server', 'httpPort', httpPort);
			await configManager!.setItem('server', 'enableApi', enableApi);
			await configManager!.setItem('server', 'enableWebApp', enableWebApp);
			console.log('configured server.');
		});
		await menu.show();
		return;
	}

	if (!coreConfig || !configManager) {
		throw new Error('core config is not found. please generate on init menu.');
	}

	// * server config

	console.log('loading server config ...');
	const serverConfig: IServerConfig = {
		httpPort: await configManager.getItem('server', 'httpPort'),
		enableApi: await configManager.getItem('server', 'enableApi'),
		enableWebApp: await configManager.getItem('server', 'enableWebApp')
	};
	verifyServerConfig(serverConfig);
	console.log('loaded server config.');

	// * PORT env variable

	if (process.env.PORT != null) {
		const parsed = parseInt(process.env.PORT);
		if (Number.isNaN(parsed)) {
			throw new Error('PORT env variable is invalid value');
		}
		serverConfig.httpPort = parsed;
	}
	if (!serverConfig.httpPort) {
		throw new Error('httpPort is not configured');
	}

	const engine = new ComponentEngine(serverConfig.httpPort, coreConfig.mongo, { });

	if (serverConfig.enableApi) {
		log('enable API component');
		engine.use(frostApi({ }));
	}

	if (serverConfig.enableWebApp) {
		log('enable WebApp component');
		engine.use(frostWeb({ }));
	}

	log('starting engine ...');
	await engine.start();
}

entryPoint()
.catch(err => {
	log(err);
});
