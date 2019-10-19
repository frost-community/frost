//import $ from 'cafy';
import argv from 'argv';
import {
	MongoProvider,
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	ActiveConfigManager,
	ConsoleMenu
} from 'frost-core';
import showServerSettingMenu from './showServerSettingMenu';
import { IBootConfig, BootConfigManager } from './BootConfig';

function log(...params: any[]) {
	console.log('[ServerEngine]', ...params);
}

class InstallApi implements IComponentInstallApi {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	db: MongoProvider;

	registerSetupMenu(setupMenu: ConsoleMenu): void {
		// TODO
	}
}

class BootApi implements IComponentBootApi {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	db: MongoProvider;

	// action
	defineAction(actionName: string, handler: (param: {[x: string]: any}) => Promise<{[x: string]: any}>): void {
		// TODO
	}
	async callAction(actionName: string, param: {[x: string]: any}): Promise<{[x: string]: any}> {
		// TODO
		return {};
	}

	// event
	emitEvent(componentName: string, eventType: string, eventData: {[x: string]: any}): void {
		// TODO
	}
	addEventListener(eventType: string, callback: (eventData: {[x: string]: any}) => void): void {
		// TODO
	}
	removeEventListener(eventType: string, callback: (eventData: {[x: string]: any}) => void): void {
		// TODO
	}
	removeAllEventListeners(eventType?: string): void {
		// TODO
	}
}

export interface ServerContext {
	components: IComponent[];
	db: MongoProvider;
}

export default class ServerEngine {
	private static async install(ctx: ServerContext, component: IComponent): Promise<void> {
		if (component.install) {
			log(`installing: ${component.name}`);
			await component.install(new InstallApi(ctx.db));
		}
	}

	private static async boot(ctx: ServerContext, component: IComponent): Promise<void> {
		log(`booting: ${component.name}`);
		await component.boot(new BootApi(ctx.db));
	}

	static async start(bootConfigFilepath: string): Promise<void> {
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
			return;
		}

		if (!bootConfig || !activeConfigManager || !db) {
			throw new Error('please generate a valid boot config on the server setting menu.');
		}

		const ctx: ServerContext = {
			db,
			components: []
		};

		for (const componentName of bootConfig.usingComponents) {
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
			ctx.components.push(component);
		}

		for (const component of ctx.components) {
			ServerEngine.install(ctx, component);
		}

		if (options.componentSetting) {
			// TODO: show the component setting menu
			return;
		}

		for (const component of ctx.components) {
			ServerEngine.boot(ctx, component);
		}
	}

}
