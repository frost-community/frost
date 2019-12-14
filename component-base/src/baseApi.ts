import Express from 'express';
import $ from 'cafy';

export enum HttpMethod {
	All,
	GET,
	POST,
	PUT,
	DELETE,
	PATCH
}

type ExpressHandler = Express.RequestHandler | Express.ErrorRequestHandler;

interface PriorityHandler<T extends ExpressHandler> {
	priority?: number;
	path?: string;
	handler: T;
}

interface RouteHandler {
	method: HttpMethod;
	path: string;
	handler: Express.RequestHandler;
}

// ----

export interface IBaseApi {
	http: IHttpApi;
}

export interface IHttpApi {
	preprocess(options: { priority?: number, path?: string }, ...handlers: Express.RequestHandler[]): void;
	route(method: HttpMethod, path: string, ...handlers: Express.RequestHandler[]): void;
	postprocess(options: { priority?: number, path?: string }, ...handlers: Express.RequestHandler[]): void;
	error(options: { priority?: number, path?: string }, ...handlers: Express.ErrorRequestHandler[]): void;
}

export class BaseApi implements IBaseApi {
	http: HttpApi;

	constructor(app: Express.Application) {
		this.http = new HttpApi(app);
	}
}

export class HttpApi implements IHttpApi {
	private app: Express.Application;
	private routeHandlers: RouteHandler[];
	private preprocessHandlers: PriorityHandler<Express.RequestHandler>[];
	private postprocessHandlers: PriorityHandler<Express.RequestHandler>[];
	private errorHandlers: PriorityHandler<Express.ErrorRequestHandler>[];

	constructor(app: Express.Application) {
		this.app = app;
		this.preprocessHandlers = [];
		this.routeHandlers = [];
		this.postprocessHandlers = [];
		this.errorHandlers = [];
	}

	preprocess(options: { priority?: number, path?: string }, ...handlers: Express.RequestHandler[]): void {
		if (options.priority != null) {
			const priorityValidation = $.number.int().range(1, 3);
			if (priorityValidation.nok(options.priority)) {
				throw new Error('priority must be a integer value between from 1 to 3');
			}
		}
		for (const handler of handlers) {
			this.preprocessHandlers.push({
				path: options.path,
				priority: options.priority,
				handler: handler
			});
		}
	}

	route(method: HttpMethod, path: string, ...handlers: Express.RequestHandler[]): void {
		for (const handler of handlers) {
			this.routeHandlers.push({
				method,
				path,
				handler
			});
		}
	}

	postprocess(options: { priority?: number, path?: string }, ...handlers: Express.RequestHandler[]): void {
		if (options.priority != null) {
			const priorityValidation = $.number.int().range(1, 3);
			if (priorityValidation.nok(options.priority)) {
				throw new Error('priority must be a integer value between from 1 to 3');
			}
		}
		for (const handler of handlers) {
			this.postprocessHandlers.push({
				path: options.path,
				priority: options.priority,
				handler: handler
			});
		}
	}

	error(options: { priority?: number, path?: string }, ...handlers: Express.ErrorRequestHandler[]): void {
		if (options.priority != null) {
			const priorityValidation = $.number.int().range(1, 3);
			if (priorityValidation.nok(options.priority)) {
				throw new Error('priority must be a integer value between from 1 to 3');
			}
		}
		for (const handler of handlers) {
			this.errorHandlers.push({
				path: options.path,
				priority: options.priority,
				handler: handler
			});
		}
	}

	registerPreprocesses() {
		// sort items by priority
		const priorityTable: Record<number, PriorityHandler<Express.RequestHandler>[]> = { 1: [], 2: [], 3: [] };
		for (const item of this.preprocessHandlers) {
			const priority = item.priority != null ? item.priority : 2;
			priorityTable[priority].push(item);
		}
		for (let i = 3; i > 0; i--) {
			for (const handler of priorityTable[i]) {
				if (handler.path) {
					this.app.use(handler.path, handler.handler);
				}
				else {
					this.app.use(handler.handler);
				}
			}
		}
	}

	registerRoutes() {
		for (const handler of this.routeHandlers) {
			switch (handler.method) {
			case HttpMethod.All:
				this.app.all(handler.path, handler.handler);
				break;
			case HttpMethod.GET:
				this.app.get(handler.path, handler.handler);
				break;
			case HttpMethod.POST:
				this.app.post(handler.path, handler.handler);
				break;
			case HttpMethod.PUT:
				this.app.put(handler.path, handler.handler);
				break;
			case HttpMethod.DELETE:
				this.app.delete(handler.path, handler.handler);
				break;
			case HttpMethod.PATCH:
				this.app.patch(handler.path, handler.handler);
				break;
			default:
				throw new Error(`method '${handler.method}' is unsupported`);
			}
		}
	}

	registerPostprocesses() {
		// sort items by priority
		const priorityTable: Record<number, PriorityHandler<Express.RequestHandler>[]> = { 1: [], 2: [], 3: [] };
		for (const item of this.postprocessHandlers) {
			const priority = item.priority != null ? item.priority : 2;
			priorityTable[priority].push(item);
		}
		for (let i = 3; i > 0; i--) {
			for (const handler of priorityTable[i]) {
				if (handler.path) {
					this.app.use(handler.path, handler.handler);
				}
				else {
					this.app.use(handler.handler);
				}
			}
		}
	}

	registerErrores() {
		// sort items by priority
		const priorityTable: Record<number, PriorityHandler<Express.ErrorRequestHandler>[]> = { 1: [], 2: [], 3: [] };
		for (const item of this.errorHandlers) {
			const priority = item.priority != null ? item.priority : 2;
			priorityTable[priority].push(item);
		}
		for (let i = 3; i > 0; i--) {
			for (const handler of priorityTable[i]) {
				if (handler.path) {
					this.app.use(handler.path, handler.handler);
				}
				else {
					this.app.use(handler.handler);
				}
			}
		}
	}
}
