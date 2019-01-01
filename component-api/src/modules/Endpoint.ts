import Express from 'express';
import { ComponentEngineManager, MongoProvider } from 'frost-component';
import { IAuthScope, AuthScopes } from './AuthScope';
import ApiResponseManager from './ApiResponse/ApiResponseManager';
import { ApiErrorSources } from './ApiResponse/ApiError';

export {
	AuthScopes,
	ApiErrorSources,
};

export interface IEndpointContextOptions {
	params?: { [x: number]: any };
}

export class EndpointManager extends ApiResponseManager {
	constructor(db: MongoProvider, options?: IEndpointContextOptions) {
		super();
		options = options || { };

		this.params = options.params || {};
		this.db = db;
	}

	params: { [x: string]: any };

	db: MongoProvider;
}

export type EndpointHandler = (ctx: EndpointManager) => (Promise<void> | void);

export interface IEndpoint {
	scopes: IAuthScope[];
	handler: EndpointHandler;
}

export interface IEndpointProperty {
	scopes?: IAuthScope[];
}

export function define(endpointProperty: IEndpointProperty, handler: EndpointHandler): IEndpoint {
	return {
		scopes: endpointProperty.scopes || [],
		handler: handler
	};
}

export function registerEndpoint(endpoint: IEndpoint, endpointPath: string, engineManager: ComponentEngineManager): void {
	engineManager.http.addRoute((app: Express.Application) => {
		app.post(`/api/${endpointPath}`, async (req, res) => {
			const endpointManager = new EndpointManager(engineManager.db, { params: req.body });

			try {
				// TODO: check scopes

				// process endpoint
				await endpoint.handler(endpointManager);

				endpointManager.transport(res);
			}
			catch (err) {
				console.log(err);
				endpointManager.error(ApiErrorSources.ServerError);

				endpointManager.transport(res);
			}
		});
	});
}
