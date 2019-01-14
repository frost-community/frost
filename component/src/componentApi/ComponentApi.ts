import Express from 'express';
import MongoProvider from "../MongoProvider";
import IComponent from '../IComponent';
import ComponentApiInternal, { HttpComponentApiInternal } from './ComponentApiInternal';
import ConsoleMenu from '../ConsoleMenu';

/*
	componentに向けたAPI
*/

// component api

export interface IComponentApiOptions {
	http?: IHttpComponentApiOptions;
}

export default class ComponentApi {
	constructor(apiInternal: ComponentApiInternal, targetComponent: IComponent, options?: IComponentApiOptions) {
		options = options || {};
		this.apiInternal = apiInternal;
		this.targetComponent = targetComponent;

		this.http = new HttpComponentApi(apiInternal.http, targetComponent, options.http);
		this.db = apiInternal.db;
	}

	private apiInternal: ComponentApiInternal;

	private targetComponent: IComponent;

	http: HttpComponentApi;

	db: MongoProvider;

	has(componentName: string) {
		return this.apiInternal.has(this.targetComponent, componentName);
	}

	registerSetupMenu(menu: ConsoleMenu) {
		this.apiInternal.registerSetupMenu(this.targetComponent, menu);
	}
}

// http component api

export interface IHttpComponentApiOptions {
}

export class HttpComponentApi {
	constructor(httpApiInternal: HttpComponentApiInternal, targetComponent: IComponent, options?: IHttpComponentApiOptions) {
		options = options || {};

		this.httpApiInternal = httpApiInternal;
		this.targetComponent = targetComponent;
	}

	private httpApiInternal: HttpComponentApiInternal;

	private targetComponent: IComponent;

	addInit(handler: HttpComponentHandler) {
		this.httpApiInternal.addInit(this.targetComponent, handler);
	}

	addRoute(handler: HttpComponentHandler) {
		this.httpApiInternal.addRoute(this.targetComponent, handler);
	}
}

export type HttpComponentHandler = (app: Express.Application) => void;
