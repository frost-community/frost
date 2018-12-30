import Express from 'express';
import { ComponentEngineManager } from '@frost/component';
import { IAuthScope, AuthScopes } from './AuthScope';
import { ApiResponseManager, ApiResultType, ApiErrorSources } from './ApiResponse';

export {
	AuthScopes,
	ApiErrorSources,
	ApiResultType,
};

export interface IEndpointContextOptions {
	params?: { [x: number]: any };
}

export class EndpointManager extends ApiResponseManager {
	constructor(options?: IEndpointContextOptions) {
		super();
		options = options || { };

		this.params = options.params || {};
	}

	params: { [x: string]: any };
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
			const endpointManager = new EndpointManager({ params: req.body });

			try {
				// TODO: check scopes

				// process endpoint
				await endpoint.handler(endpointManager);

				endpointManager.respond(res);
			}
			catch (err) {
				console.log(err);
				endpointManager.error(ApiErrorSources.ServerError);

				endpointManager.respond(res);
			}
		});
	});
}
