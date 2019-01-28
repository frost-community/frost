import { Request, Response, NextFunction, RequestHandler } from 'express';
import $, { Context as CafyContext } from 'cafy';
import passport from 'passport';
import { ComponentApi, MongoProvider } from 'frost-component';
import { IAuthScope, AuthScopes } from './authScope';
import IApiConfig from './IApiConfig';
import { IDocument, TokenDocument, UserDocument, AppDocument, IPopulatableDocument } from './documents';
import ApiResponseManager, { IApiResponseSource } from './apiResponse/ApiResponseManager';
import { ApiErrorSources } from './apiResponse/apiError';
import buildHttpResResolver from './apiResponse/buildHttpResResolver';

import UserService from '../services/UserService';
import PostingService from '../services/PostingService';
import UserRelationService from '../services/UserRelationService';
import AppService from '../services/AppService';
import TokenService from '../services/TokenService';

export {
	AuthScopes,
	ApiErrorSources,
};

export interface IAuthInfo {
	user: UserDocument;
	app: AppDocument;
	token: TokenDocument;
}

export interface IEndpointContextOptions {
	params?: { [x: number]: any };
	authInfo?: IAuthInfo;
}

export class EndpointManager extends ApiResponseManager {
	constructor(db: MongoProvider, config: IApiConfig, resResolver: (source: IApiResponseSource) => any, options?: IEndpointContextOptions) {
		super(resResolver);
		options = options || { };

		this.params = options.params || {};
		this.authInfo = options.authInfo;
		this.db = db;
		this.config = config;

		// services
		this.userService = new UserService(db);
		this.postingService = new PostingService(db);
		this.userRelationService = new UserRelationService(db, this);
		this.appService = new AppService(db);
		this.tokenService = new TokenService(db);
	}

	params: { [x: string]: any };

	authInfo?: IAuthInfo;

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

	async populateAll<PackingObject>(docs: IPopulatableDocument<PackingObject>[]): Promise<void> {
		await Promise.all(docs.map(doc => doc.populate(this.db)));
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

export function registerEndpoint(endpoint: IEndpoint, endpointPath: string, middlewares: RequestHandler[], componentApi: ComponentApi, config: IApiConfig): void {

	// if some scopes is needed, requesting an AccessToken
	function authorization(req: Request, res: Response, next: NextFunction) {
		if (endpoint.scopes.length == 0) {
			return next();
		}
		passport.authenticate('accessToken', { session: false, failWithError: true })(req, res, next);
	}

	componentApi.http.addRoute((app) => {
		app.post(`/api/${endpointPath}`, ...middlewares, authorization, async (req, res) => {
			const endpointManager = new EndpointManager(
				componentApi.db,
				config,
				buildHttpResResolver(res),
				{ params: req.body });

			try {

				// check scopes

				if (endpoint.scopes.length > 0) {
					if (!req.authInfo) {
						console.log('[debug] authInfo is empty');
						endpointManager.error(ApiErrorSources.nonAuthorized);
						return;
					}

					const appDoc: AppDocument = req.authInfo.app;
					const tokenDoc: TokenDocument = req.authInfo.token;
					const userDoc: UserDocument = req.user;
					endpointManager.authInfo = {
						app: appDoc,
						token: tokenDoc,
						user: userDoc
					};

					const missingScopes = endpoint.scopes.filter(neededScope => tokenDoc.scopes.indexOf(neededScope.id) == -1);
					const missingScopeIds = missingScopes.map(scope => scope.id);
					if (missingScopeIds.length > 0) {
						endpointManager.error(ApiErrorSources.missingScope, { missingScopes: missingScopeIds });
						return;
					}
				}

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
						return;
					}
					// validation
					let [param, errorParam] = validator.get(endpointManager.params[paramName]);
					if (param === null) {
						endpointManager.params[paramName] = undefined;
					}
					if (errorParam) {
						endpointManager.error(ApiErrorSources.invalidParamFormat, { paramName: paramName });
						return;
					}
				}

				// process endpoint
				await endpoint.handler(endpointManager);
			}
			catch (err) {
				console.log(err);
				endpointManager.error(ApiErrorSources.serverError);
			}
		});
	});
}
