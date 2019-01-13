import Express from 'express';
import $, { Context as CafyContext } from 'cafy';
import { ComponentEngineManager, MongoProvider } from 'frost-component';
import { IAuthScope, AuthScopes } from './authScope';
import IApiConfig from './IApiConfig';
import { IDocument } from './documents';
import ApiResponseManager from './apiResponse/ApiResponseManager';
import { ApiErrorSources } from './apiResponse/apiError';

import UserService from '../services/UserService';
import PostingService from '../services/PostingService';
import UserRelationService from '../services/UserRelationService';
import AppService from '../services/AppService';
import TokenService from '../services/TokenService';

export {
	AuthScopes,
	ApiErrorSources,
};

export interface IEndpointContextOptions {
	params?: { [x: number]: any };
}

export class EndpointManager extends ApiResponseManager {
	constructor(db: MongoProvider, config: IApiConfig, options?: IEndpointContextOptions) {
		super();
		options = options || { };

		this.params = options.params || {};
		this.db = db;
		this.config = config;

		// services
		this.userService = new UserService(db);
		this.postingService = new PostingService(db);
		this.userRelationService = new UserRelationService(db, this);
		this.appService = new AppService(db, config);
		this.tokenService = new TokenService(db);
	}

	params: { [x: string]: any };

	db: MongoProvider;

	config: IApiConfig;

	userService: UserService;

	postingService: PostingService;

	userRelationService: UserRelationService;

	appService: AppService;

	tokenService: TokenService;

	packAll<PackingObject>(docs: IDocument<PackingObject>[]): Promise<PackingObject[]> {
		return Promise.all(docs.map(doc => doc.pack(this.db)));
	}
}

export type EndpointHandler = (ctx: EndpointManager) => (Promise<void> | void);

export interface IEndpoint {
	scopes: IAuthScope[];
	params: { [x: string]: CafyContext };
	handler: EndpointHandler;
}

export interface IEndpointProperty {
	scopes?: IAuthScope[];
	params?: { [x: string]: CafyContext };
}

export function define(endpointProperty: IEndpointProperty, handler: EndpointHandler): IEndpoint {
	return {
		scopes: endpointProperty.scopes || [],
		params: endpointProperty.params || {},
		handler: handler
	};
}

export function registerEndpoint(endpoint: IEndpoint, endpointPath: string, engineManager: ComponentEngineManager, config: IApiConfig): void {
	engineManager.http.addRoute((app: Express.Application) => {
		app.post(`/api/${endpointPath}`, async (req, res) => {
			const endpointManager = new EndpointManager(engineManager.db, config, { params: req.body });

			try {
				// TODO: check scopes

				// check params

				for (const paramName of Object.keys(endpoint.params)) {
					let validator = endpoint.params[paramName];
					// if validator is optional, to be nullable
					if (validator.isOptional) {
						validator = validator.nullable;
					}
					// check missing param
					if (!validator.isOptional && $.any.nullable.nok(endpointManager.params[paramName])) {
						endpointManager.error(ApiErrorSources.missingParam, { paramName: paramName });
						endpointManager.transport(res);
						return;
					}
					// validation
					let [param, errorParam] = validator.get(endpointManager.params[paramName]);
					if (param === null) {
						endpointManager.params[paramName] = undefined;
					}
					if (errorParam) {
						endpointManager.error(ApiErrorSources.invalidParamFormat, { paramName: paramName });
						endpointManager.transport(res);
						return;
					}
				}

				// process endpoint
				await endpoint.handler(endpointManager);
				endpointManager.transport(res);
			}
			catch (err) {
				console.log(err);
				endpointManager.error(ApiErrorSources.serverError);
				endpointManager.transport(res);
			}
		});
	});
}
