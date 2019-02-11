import Express from 'express';
import passport from 'passport';
import argv from 'argv';
import { MongoProvider, ConsoleMenu } from 'frost-core';
import ComponentApi from './componentApi/ComponentApi';
import ComponentApiInternal from './componentApi/ComponentApiInternal';
import IComponent from './IComponent';
import setupComponentMenu from './setupComponentMenu';

export interface IMongoInfo {
	url: string;
	dbName: string;
}

export interface IComponentEngineOptions {
}

// componentを組み合わせて実行する
export default class ComponentEngine {
	constructor(httpPort: number, mongoInfo: IMongoInfo, options?: IComponentEngineOptions) {
		options = options || {};

		this.components = [];
		this.setupMenus = [];

		this.httpPort = httpPort;
		this.mongoInfo = mongoInfo;
	}

	private httpPort: number;

	private mongoInfo: IMongoInfo;

	private components: IComponent[];

	setupMenus: { component: IComponent, setupMenu: ConsoleMenu }[];

	has(componentName: string): boolean {
		return this.components.find(component => component.name == componentName) != null;
	}

	use(component: IComponent) {
		if (this.components.some(c => c.name == component.name)) {
			throw new Error('exists same component name');
		}
		this.components.push(component);
	}

	async start() {

		const log = (...params: any[]) => {
			console.log('[ComponentEngine]', ...params);
		};

		log('database: connecting ...');
		const db = await MongoProvider.connect(this.mongoInfo.url, this.mongoInfo.dbName);

		log('components: initializing ...');
		const initializedData: { component: IComponent, setupMenu?: ConsoleMenu }[] = [];
		for (const component of this.components) {
			if (component.init) {
				initializedData.push({
					component: component,
					setupMenu: (await component.init({ db })).setupMenu
				});
			}
		}

		// options

		argv.option({
			name: 'setup',
			short: 's',
			type: 'boolean',
			description: 'Display setup mode'
		});

		const { options } = argv.run();

		// (mode) setup

		if (options.setup) {

			log('setup mode');

			const setupMenus = initializedData
				.map(c => { return { setupMenu: c.setupMenu, component: c.component }; })
				.filter((c): c is { setupMenu: ConsoleMenu, component: IComponent } => c.setupMenu != null);

			await setupComponentMenu(setupMenus);

			log('database: disconnecting ...');
			await db.disconnect();

			return;
		}

		// (mode) server

		log('server mode');

		const apiInternal = new ComponentApiInternal(this, db);

		log('components: starting ...');

		try {
			for (const component of this.components) {
				await component.handler(new ComponentApi(apiInternal, component));
			}
		}
		catch (err) {
			log('component error:');
			console.error(err);

			log('database: disconnecting ...');
			await db.disconnect();

			return;
		}

		// http

		log('http: initialize ...');

		const app = Express();
		app.set('views', apiInternal.http.viewPathes);
		app.set('view engine', 'pug');

		app.use(passport.initialize());

		log('http: registering init handlers ...');

		for (const initHandler of apiInternal.http.initHandlers) {
			await initHandler(app);
		}

		log('http: registering route handlers ...');

		for (const routeHandler of apiInternal.http.routeHandlers) {
			await routeHandler(app);
		}

		app.listen(this.httpPort, () => {
			log('http: started server.');
		});

		log('ready.');
	}
}
