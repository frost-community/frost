import Express from 'express';
import { generateDynamicMiddlerware, generateDynamicErrorMiddleware, DynamicHandler, addHandler } from './modules/dynamicHandling';

export enum HttpMethod {
	All,
	GET,
	POST,
	PUT,
	DELETE,
	PATCH
}

export interface IBaseApi {
	http: IHttpApi;
}

export interface IHttpApi {
	addPreprocessHandler(options: { priority?: number, path?: string }, ...handlers: Express.RequestHandler[]): void;
	addErrorHandler(options: { priority?: number, path?: string }, ...handlers: Express.ErrorRequestHandler[]): void;
	addRoute(method: HttpMethod, path: string, ...handlers: Express.RequestHandler[]): void;
}

export class BaseApi implements IBaseApi {
	http: HttpApi;

	constructor(app: Express.Application) {
		this.http = new HttpApi(app);
	}
}

export class HttpApi implements IHttpApi {
	private app: Express.Application;
	private preprocessHandlers: DynamicHandler<Express.RequestHandler>[];
	private errorHandlers: DynamicHandler<Express.ErrorRequestHandler>[];

	constructor(app: Express.Application) {
		this.app = app;
		this.preprocessHandlers = [];
		this.errorHandlers = [];
	}

	addPreprocessHandler(options: { priority?: number, path?: string }, ...handlers: Express.RequestHandler[]): void {
		addHandler(this.preprocessHandlers, options, ...handlers);
	}

	addErrorHandler(options: { priority?: number, path?: string }, ...handlers: Express.ErrorRequestHandler[]): void {
		addHandler(this.errorHandlers, options, ...handlers);
	}

	addRoute(method: HttpMethod, path: string, ...handlers: Express.RequestHandler[]): void {
		switch (method) {
		case HttpMethod.All:
			this.app.all(path, ...handlers);
			break;
		case HttpMethod.GET:
			this.app.get(path, ...handlers);
			break;
		case HttpMethod.POST:
			this.app.post(path, ...handlers);
			break;
		case HttpMethod.PUT:
			this.app.put(path, ...handlers);
			break;
		case HttpMethod.DELETE:
			this.app.delete(path, ...handlers);
			break;
		case HttpMethod.PATCH:
			this.app.patch(path, ...handlers);
			break;
		default:
			throw new Error(`method '${method}' is unsupported`);
		}
	}

	registerPreprocessMiddleware() {
		const preprocessMiddleware = generateDynamicMiddlerware(this.preprocessHandlers);
		this.app.use(preprocessMiddleware);
	}

	registerErrorMiddleware() {
		const errorMiddleware = generateDynamicErrorMiddleware(this.errorHandlers);
		this.app.use(errorMiddleware);
	}
}
