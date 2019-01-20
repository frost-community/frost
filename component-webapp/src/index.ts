import { ComponentApi, IComponent } from 'frost-component';
import IWebAppConfig from './modules/IWebAppConfig';
import verifyWebAppConfig from './modules/verifyWebAppConfig';
import axios, { AxiosResponse } from 'axios';

export {
	IWebAppConfig
};

class HttpError extends Error {
	constructor(status: number, data: any) {
		super('http error');
		this.status = status;
		this.data = data;
	}
	status: number;
	data: any;
}

export interface IWebOptions {
}

export default (config: IWebAppConfig, options?: IWebOptions): IComponent => {
	verifyWebAppConfig(config);

	const log = (...params: any[]) => {
		console.log('[WebApp]', ...params);
	};

	function handler(componentApi: ComponentApi) {

		componentApi.http.addRoute((app) => {

			type ValidationResult = {
				isValid: string;
				userId: string;
			};

			const validateCredential = async (screenName: string, password: string): Promise<ValidationResult> => {
				// * validate credential
				const validation = await axios.post(`${config.apiUrl}/auth/credential/validate`, {
					screenName: screenName,
					password: password
				});
				// expect: status 200
				if (validation.status != 200) {
					log('failed to request /auth/credential/validate');
					log('statusCode:', validation.status);
					log('data:', validation.data);
					throw new HttpError(500, { error: { reason: 'server_error' } });
				}
				return {
					isValid: validation.data.result.isValid,
					userId: validation.data.result.userId
				};
			};

			type TokenInfo = {
				appId: string,
				userId: string,
				scopes: string[],
				accessToken: string
			};

			const getToken = async (userId: string, scopes: string[]): Promise<TokenInfo> => {

				let tokenResult: AxiosResponse<any>;
				tokenResult = await axios.post(`${config.apiUrl}/auth/token/get`, {
					appId: config.appId,
					userId: userId,
					scopes: scopes
				});
				// expect: status 200 or error token_not_found
				if (tokenResult.status != 200 && (tokenResult.status != 400 || tokenResult.data.error.reason != 'token_not_found')) {
					log('failed to request /auth/token/get');
					log('statusCode:', tokenResult.status);
					log('data:', tokenResult.data);
					throw new HttpError(500, { error: { reason: 'server_error' } });
				}

				// if token is not found, create a token
				if (tokenResult.status == 400) {
					tokenResult = await axios.post(`${config.apiUrl}/auth/token/create`, {
						appId: config.appId,
						userId: userId,
						scopes: scopes
					});
					if (tokenResult.status != 200) {
						log('failed to request /auth/token/create');
						log('statusCode:', tokenResult.status);
						log('data:', tokenResult.data);
						throw new HttpError(500, { error: { reason: 'server_error' } });
					}
				}

				return {
					appId: tokenResult.data.result.appId,
					userId: tokenResult.data.result.userId,
					scopes: scopes,
					accessToken: tokenResult.data.result.accessToken
				};
			};

			app.post('/session', async (req, res) => {
				try {
					const validation = await validateCredential(req.params.screenName, req.params.password);
					if (!validation.isValid) {
						res.status(400).json({ error: { reason: 'invalid_credential' } });
						return;
					}

					const tokenInfo = await getToken(validation.userId, config.token.scopes);
					res.status(200).json(tokenInfo);
				}
				catch (err) {
					if (err instanceof HttpError) {
						res.status(err.status).json(err.data);
						return;
					}
					else {
						throw err;
					}
				}
			});

			app.post('/session/register', async (req, res) => {

				// TODO: reCAPTCHA

				const creationResult = await axios.post(`${config.apiUrl}/user/create`, {
					screenName: req.params.screenName,
					password: req.params.password,
					description: req.params.description
				});
				if (creationResult.status != 200 && (creationResult.status != 400 || creationResult.data.error.reason != 'duplicated_screen_name')) {
					res.status(500).json({ error: { reason: 'server_error' } });
					return;
				}
				if (creationResult.status == 400) {
					res.status(400).json({ error: { reason: 'duplicated_screen_name' } });
					return;
				}

				let tokenInfo: TokenInfo;
				try {
					tokenInfo = await getToken(creationResult.data.result.id, config.token.scopes);
				}
				catch (err) {
					if (err instanceof HttpError) {
						res.status(err.status).json(err.data);
						return;
					}
					else {
						throw err;
					}
				}

				res.status(200).json(tokenInfo);
			});

			app.get('/', (req, res) => {
				res.send('frost');
			});
		});
	}

	return {
		name: 'webapp',
		handler: handler
	};
};
