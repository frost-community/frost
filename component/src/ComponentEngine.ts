import Express, { Express as ExpressInstance } from 'express';
import passport from 'passport';
import { MongoProvider, ConsoleMenu } from 'frost-core';
import ComponentApi from './componentApi/ComponentApi';
import ComponentApiInternal from './componentApi/ComponentApiInternal';
import IComponent from './IComponent';

export interface IComponentEngineOptions {
}

const log = (...params: any[]) => {
	console.log('[ComponentEngine]', ...params);
};

/**
 * provide to execute some components on the server
*/
export default class ComponentEngine {
	constructor(httpPort: number, db: MongoProvider, options?: IComponentEngineOptions) {
		options = options || {};

		this.components = [];
		this.setupMenus = [];

		this.httpPort = httpPort;
		this.db = db;
	}

	private isInitialized = false;

	private httpPort: number;

	private db: MongoProvider;

	private components: IComponent[];

	private setupMenus: { component: IComponent, setupMenu: ConsoleMenu }[];

	http: ExpressInstance | undefined;

	has(componentName: string): boolean {
		return this.components.find(component => component.name == componentName) != null;
	}

	use(component: IComponent) {
		if (this.components.some(c => c.name == component.name)) {
			throw new Error('exists same component name');
		}
		this.components.push(component);
	}

	async initializeComponents() {
		log('components: initializing ...');
		const initializedData: { component: IComponent, setupMenu?: ConsoleMenu }[] = [];
		for (const component of this.components) {
			if (component.init) {
				initializedData.push({
					component: component,
					setupMenu: (await component.init({ db: this.db })).setupMenu
				});
			}
		}

		this.setupMenus = initializedData
			.filter((c): c is { setupMenu: ConsoleMenu, component: IComponent } => c.setupMenu != null);

		this.isInitialized = true;
	}

	async showComponentMenu() {
		if (!this.isInitialized) {
			throw new Error('showComponentMenu need to called after components initialization.');
		}

		const componentMenu = new ConsoleMenu('Select a component to setup');

		componentMenu.add(' * close menu * ', () => true, (ctx) => ctx.closeMenu());
		for (const setupMenu of this.setupMenus) {
			componentMenu.add(setupMenu.component.name, () => true, async (ctx) => {
				await setupMenu.setupMenu.show();
			});
		}

		await componentMenu.show();
		console.log();
	}

	async startComponents() {
		if (!this.isInitialized) {
			throw new Error('startComponents need to called after components initialization.');
		}

		const apiInternal = new ComponentApiInternal(this, this.db);

		log('components: starting ...');

		try {
			for (const component of this.components) {
				await component.handler(new ComponentApi(apiInternal, component));
			}
		}
		catch (err) {
			console.error(err);
			throw new Error('component starting error');
		}

		// http

		log('http: initializing ...');

		this.http = Express();
		this.http.set('views', apiInternal.http.viewPathes);
		this.http.set('view engine', 'pug');

		this.http.use(passport.initialize());

		log('http: registering init handlers ...');

		for (const initHandler of apiInternal.http.initHandlers) {
			await initHandler(this.http);
		}

		log('http: registering route handlers ...');

		for (const routeHandler of apiInternal.http.routeHandlers) {
			await routeHandler(this.http);
		}

		this.http.listen(this.httpPort, () => {
			log('http: started server.');
		});

		log('ready.');
	}
}
