import { EventEmitter } from 'events';
import argv from 'argv';
import { MongoProvider, IComponent, ActiveConfigManager, verifyComponent, getDataVersionState, DataVersionState } from 'frost-core';
import { InstallApi, BootApi } from './serverEngineApis';
import showServerInit from './showServerInit';
import showServerMenu, { SetupItem } from './showServerMenu';
import { BootConfigManager, IBootConfig } from './bootConfig';
import resolveDependency from './resolveDependency';
import { loadServerConfig } from './serverConfig';

function log(...params: any[]) {
	console.log('[ServerEngine]', ...params);
}

export const meta = {
	dataVersion: 1
};

export default class ServerEngine {
	async start(bootConfigFilepath: string): Promise<void> {
		// parse the option args
		argv.option({
			name: 'init',
			type: 'boolean',
			description: 'Initialize the server'
		});
		argv.option({
			name: 'config',
			type: 'boolean',
			description: 'Display the config menu'
		});
		const { options } = argv.run();

		// server init mode
		if (options.init) {
			await showServerInit();
			return;
		}

		const components: IComponent[] = [];
		const setupItems: SetupItem[] = [];
		const messenger: EventEmitter = new EventEmitter();
		let bootConfig: IBootConfig;
		let db: MongoProvider;
		let activeConfigManager: ActiveConfigManager;

		// boot config
		try {
			//log('loading boot config ...');
			if (process.env.FROST_BOOT != null) {
				log(`loading boot config from FROST_BOOT env variable ...`);
				bootConfig = JSON.parse(process.env.FROST_BOOT) as IBootConfig;
			}
			else {
				log(`loading boot config from boot-config.json ...`);
				bootConfig = require(bootConfigFilepath) as IBootConfig;
			}
			BootConfigManager.verify(bootConfig);
			log('loaded boot config.');
		}
		catch (err) {
			log('server error: failed to load the boot config. please execute a command `npm run init` to initialize the server.');
			return;
		}

		// database connection
		log('connecting db ...');
		db = await MongoProvider.connect(bootConfig.mongo.url, bootConfig.mongo.dbName);
		log('connected db.');

		try {
			// active config manager
			activeConfigManager = new ActiveConfigManager(db);

			// data version
			log('checking dataVersion ...');
			const dataVersionState = await getDataVersionState(activeConfigManager, meta.dataVersion, 'server');
			if (dataVersionState != DataVersionState.ready) {
				if (dataVersionState == DataVersionState.needInitialization) {
					log('please initialize in setup mode.');
				}
				else {
					log('this dataVersion is not supported. please clear database and restart.');
				}
				throw new Error('server error: data version is invalid.');
			}

			// load config
			const serverConfig = await loadServerConfig(activeConfigManager);

			for (const componentName of serverConfig.components) {
				if (!/^[a-z0-9_-]+$/i.test(componentName)) {
					throw new Error(`invalid component name: ${componentName}`);
				}

				let componentFn;
				try {
					componentFn = require(componentName);
					if (componentFn.default) {
						componentFn = componentFn.default;
					}
					if (typeof componentFn != 'function') {
						throw new Error(`server error: component module must be a function that returns IComponent.(component name: ${componentName})`);
					}
				}
				catch (err) {
					throw new Error(`server error: failed to load ${componentName} component.`);
				}
				const component = componentFn();
				if (!verifyComponent(component)) {
					throw new Error(`server error: failed to load ${componentName} component.`);
				}
				components.push(component);
			}

			// dependency resolution
			const resolusionResult = resolveDependency(components);
			components.splice(0, components.length);
			components.push(...resolusionResult);

			for (const component of components) {
				if (component.install) {
					log(`installing: ${component.name}`);
					await component.install(new InstallApi(component, db, setupItems));
				}
			}

			// server config mode
			if (options.config) {
				await showServerMenu(setupItems, activeConfigManager);
				await db.disconnect();
				return;
			}

			const componentApis: any[] = [];
			for (const component of components) {
				log(`booting: ${component.name}`);
				const componentApi = await component.boot(new BootApi(component, components, componentApis, db, messenger));
				componentApis.push(componentApi);
			}

			messenger.emit('server.bootCompleted');
		}
		catch (err) {
			await db.disconnect();
			throw err;
		}
	}
}
