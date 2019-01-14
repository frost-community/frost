import MongoProvider from "../MongoProvider";
import ComponentEngine from "../ComponentEngine";
import IComponent from '../IComponent';
import { HttpComponentHandler } from './ComponentApi';
import ConsoleMenu from "../ConsoleMenu";

// component api (internal)

export interface IComponentApiInternalOptions {
	http?: IHttpComponentApiInternalOptions;
}

export default class ComponentApiInternal {
	constructor(engine: ComponentEngine, db: MongoProvider, options?: IComponentApiInternalOptions) {
		options = options || {};

		this.engine = engine;

		this.db = db;
		this.http = new HttpComponentApiInternal(engine, options.http);
	}

	private engine: ComponentEngine;

	http: HttpComponentApiInternal;

	db: MongoProvider;

	has(accessFrom: IComponent, componentName: string) {
		return this.engine.has(componentName);
	}

	registerSetupMenu(accessFrom: IComponent, menu: ConsoleMenu) {
		this.engine.setupMenus.push({ component: accessFrom, setupMenu: menu });
	}
}

// http component api (internal)

export interface IHttpComponentApiInternalOptions {
}

export class HttpComponentApiInternal {
	constructor(engine: ComponentEngine, options?: IHttpComponentApiInternalOptions) {
		options = options || {};

		this.engine = engine;

		this.initHandlers = [];
		this.routeHandlers = [];
	}

	private engine: ComponentEngine;

	initHandlers: HttpComponentHandler[];

	routeHandlers: HttpComponentHandler[];

	addInit(accessFrom: IComponent, handler: HttpComponentHandler) {
		this.initHandlers.push(handler);
	}

	addRoute(accessFrom: IComponent, handler: HttpComponentHandler) {
		this.routeHandlers.push(handler);
	}
}
