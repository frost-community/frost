import { EventEmitter } from 'events';
import argv from 'argv';
import {
	MongoProvider,
	IComponent,
	ActiveConfigManager,
	verifyComponent
} from 'frost-core';
import showServerSettingMenu from './showServerSettingMenu';
import {
	InstallApi,
	BootApi
} from './serverEngineApis';
import showComponentSettingMenu, { SetupItem } from './showComponentSettingMenu';
import { BootConfigManager, IBootConfig } from './bootConfig';

function log(...params: any[]) {
	console.log('[ServerEngine]', ...params);
}

export default class ServerEngine {
	private components: IComponent[];
	private db?: MongoProvider;
	private messenger: EventEmitter;
	private setupItems: SetupItem[];

	constructor() {
		this.components = [];
		this.messenger = new EventEmitter();
		this.setupItems = [];
	}

	private async install(component: IComponent, bootConfig: IBootConfig): Promise<void> {
		if (!this.db) throw new Error('need to start the ServerEngine');
		if (component.install) {
			log(`installing: ${component.name}`);
			await component.install(new InstallApi(component, this.db, this.setupItems, bootConfig));
		}
	}

	private async boot(component: IComponent, bootConfig: IBootConfig): Promise<void> {
		if (!this.db) throw new Error('need to start the ServerEngine');
		log(`booting: ${component.name}`);
		await component.boot(new BootApi(component, this.db, this.messenger, bootConfig));
	}

	async start(bootConfigFilepath: string): Promise<void> {
		// option args
		argv.option({
			name: 'serverSetting',
			type: 'boolean',
			description: 'Display server setting menu'
		});
		argv.option({
			name: 'componentSetting',
			type: 'boolean',
			description: 'Display component setting menu'
		});
		const { options } = argv.run();

		// boot config
		log('loading boot config ...');
		let bootConfig: IBootConfig | undefined;
		let db: MongoProvider | undefined;
		let activeConfigManager: ActiveConfigManager | undefined;
		try {
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

			// PORT env variable
			if (process.env.PORT != null) {
				const parsed = parseInt(process.env.PORT);
				if (Number.isNaN(parsed)) {
					throw new Error('PORT env variable is invalid value');
				}
				bootConfig.httpPort = parsed;
			}

			if (!bootConfig.httpPort) {
				throw new Error('httpPort is not configured');
			}

			// database connection
			if (bootConfig) {
				log('connecting db ...');
				db = await MongoProvider.connect(bootConfig.mongo.url, bootConfig.mongo.dbName);
				log('connected db.');

				activeConfigManager = new ActiveConfigManager(db);
			}
		}
		catch (err) {
			log('valid boot config was not found:');
			log(err.message);
		}

		// server setting menu
		if (options.serverSetting) {
			await showServerSettingMenu(activeConfigManager);
			if (db) {
				await db.disconnect();
			}
			return;
		}

		if (!bootConfig || !activeConfigManager || !db) {
			throw new Error('please generate a valid boot config on the server setting menu.');
		}

		for (const componentName of bootConfig.usingComponents) {
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
					throw new Error(`component module must be a function that returns IComponent.(component name: ${componentName})`);
				}
			}
			catch (err) {
				throw new Error(`failed to load ${componentName} component`);
			}
			const component = componentFn();
			if (!verifyComponent(component)) {
				throw new Error(`failed to load ${componentName} component`);
			}
			this.components.push(component);
		}

		for (const component of this.components) {
			this.install(component, bootConfig);
		}

		if (options.componentSetting) {
			showComponentSettingMenu(this.setupItems);
			if (db) {
				await db.disconnect();
			}
			return;
		}

		for (const component of this.components) {
			this.boot(component, bootConfig);
		}
	}
}
