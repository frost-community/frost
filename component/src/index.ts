import Express from 'express';
import MongoProvider from './MongoProvider';

export interface IComponent {
	name: string;
	handler: (ctx: ComponentEngineManager) => void;
}

export interface IComponentEngineHttpManagerOptions {
}

export interface IComponentEngineManagerOptions {
	http?: IComponentEngineHttpManagerOptions;
}

export interface IComponentEngineOptions {
	httpPort?: number;
}

export type HttpComponentHandler = (app: Express.Application) => void;

export class ComponentEngineHttpManager {
	constructor(options?: IComponentEngineHttpManagerOptions) {
		options = options || {};

		this.initHandlers = [];
		this.routeHandlers = [];
	}

	initHandlers: HttpComponentHandler[];

	routeHandlers: HttpComponentHandler[];

	addInit(handler: HttpComponentHandler) {
		this.initHandlers.push(handler);
	}

	addRoute(handler: HttpComponentHandler) {
		this.routeHandlers.push(handler);
	}
}

export class ComponentEngineManager {
	constructor(engine: ComponentEngine, db: MongoProvider, options?: IComponentEngineManagerOptions) {
		options = options || {};

		this.engine = engine;
		this.db = db;
		this.http = new ComponentEngineHttpManager(options.http);
	}

	http: ComponentEngineHttpManager;

	db: MongoProvider;

	private engine: ComponentEngine;

	has(componentName: string) {
		return this.engine.has(componentName);
	}
}

export class ComponentEngine {
	constructor(options?: IComponentEngineOptions) {
		options = options || {};

		this.components = [];

		this.httpPort = options.httpPort || 3000;
	}

	private httpPort: number;

	private components: IComponent[];

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

		// general

		const app = Express();

		log('connecting database ...');
		const db = await MongoProvider.connect('mongodb://localhost:27017', 'frost_1');

		const manager = new ComponentEngineManager(this, db, { });

		log('starting components ...');

		for (const component of this.components) {
			await component.handler(manager);
		}

		// http

		log('http: registering init handlers ...');

		for (const initHandler of manager.http.initHandlers) {
			await initHandler(app);
		}

		log('http: registering route handlers ...');

		for (const routeHandler of manager.http.routeHandlers) {
			await routeHandler(app);
		}

		app.listen(this.httpPort, () => {
			log('http: started server.');
		});

		log('ready.');
	}
}
