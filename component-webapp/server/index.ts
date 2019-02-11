import path from 'path';
import axios, { AxiosResponse } from 'axios';
import express from 'express';
import { ComponentApi, IComponent, MongoProvider, ConfigManager } from 'frost-component';
import IWebAppConfig from './modules/IWebAppConfig';
import verifyWebAppConfig from './modules/verifyWebAppConfig';
import validateCredential from './modules/validateCredential';
import getToken, { ITokenInfo } from './modules/getToken';
import { HttpError } from './modules/errors';
import bodyParser from 'body-parser';
import createToken from './modules/createToken';
import getTokenByAccessToken from './modules/getTokenByAccessToken';
import log from './modules/log';
import setupMenu from './modules/setup/setupMenu';
import getDataFormatState, { DataFormatState } from './modules/getDataFormatState';

const meta = {
	currentDataVersion: 1
};

export {
	IWebAppConfig
};

export interface IWebOptions {
}

export default (options?: IWebOptions): IComponent => {
	async function init(manager: { db: MongoProvider }) {

		// * setup menu

		const menu = await setupMenu(manager.db, meta.currentDataVersion);

		return {
			setupMenu: menu
		};
	}

	async function handler(componentApi: ComponentApi) {

		// * data format

		log('checking dataFormat ...');
		const dataFormatState: DataFormatState = await getDataFormatState(componentApi.db, meta.currentDataVersion);
		if (dataFormatState != DataFormatState.ready) {
			if (dataFormatState == DataFormatState.needInitialization) {
				log('please initialize in setup mode.');
			}
			else if (dataFormatState == DataFormatState.needMigration) {
				log('migration is required. please migrate database in setup mode.');
			}
			else {
				log('this format is not supported. there is a possibility it was used by a newer webapp component. please clear database and restart.');
			}
			throw new Error('failed to start webapp');
		}

		// * verify config

		const configManager = new ConfigManager(componentApi.db);

		const config: IWebAppConfig = {
			apiBaseUrl: await configManager.getItem('webapp', 'apiBaseUrl'),
			hostToken: {
				accessToken: await configManager.getItem('webapp', 'hostToken.accessToken')
			},
			clientToken: {
				scopes: await configManager.getItem('webapp', 'clientToken.scopes')
			},
			recaptcha: {
				enable: await configManager.getItem('webapp', 'recaptcha.enable'),
				siteKey: await configManager.getItem('webapp', 'recaptcha.siteKey'),
				secretKey: await configManager.getItem('webapp', 'recaptcha.secretKey')
			}
		};
		verifyWebAppConfig(config);

		// * routings

		componentApi.http.addRoute((app) => {
			app.use(express.static(path.resolve(__dirname, './frontend'), { etag: false }));

			let hostTokenInfo: ITokenInfo | undefined;

			app.post('/session', bodyParser.json(), async (req, res) => {
				let tokenInfo: ITokenInfo | null;
				let userGetResult: AxiosResponse<any>;
				try {
					const validation = await validateCredential(req.body.screenName, req.body.password, configManager);
					if (!validation.isValid) {
						res.status(400).json({ error: { reason: 'invalid_credential' } });
						return;
					}

					// for the first time only, fetch host token info
					if (!hostTokenInfo) {
						hostTokenInfo = await getTokenByAccessToken(config.hostToken.accessToken, configManager);
					}

					// get token
					tokenInfo = await getToken(validation.userId, hostTokenInfo.appId, config.clientToken.scopes, configManager);

					// if token is not found, create a token
					if (!tokenInfo) {
						tokenInfo = await createToken(validation.userId, hostTokenInfo.appId, config.clientToken.scopes, configManager);
					}

					userGetResult = await axios.post(`${config.apiBaseUrl}/user/get`, {
						userId: tokenInfo.userId
					}, { headers: { authorization: `bearer ${config.hostToken.accessToken}` }, validateStatus: () => true });
					if (userGetResult.status != 200) {
						log('failed to request /user/get');
						log('statusCode:', userGetResult.status);
						log('data:', userGetResult.data);
						res.status(500).json({ error: { reason: 'server_error' } });
						return;
					}
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

				res.status(200).json({
					user: userGetResult.data.result,
					scopes: tokenInfo.scopes,
					accessToken: tokenInfo.accessToken
				});
			});

			app.post('/session/register', bodyParser.json(), async (req, res) => {

				// reCAPTCHA
				if (config.recaptcha.enable) {
					let recaptchaResult = await axios.post('https://www.google.com/recaptcha/api/siteverify', {
						secret: config.recaptcha.secretKey,
						response: req.body.recaptchaToken
					}, { validateStatus: () => true });
					if (recaptchaResult.status != 200) {
						log('failed to request recaptcha');
						log('statusCode:', recaptchaResult.status);
						log('data:', recaptchaResult.data);
						res.status(500).json({ error: { reason: 'server_error' } });
						return;
					}
					if (recaptchaResult.data.success !== true) {
						res.status(400).json({ error: { reason: 'invalid_recaptcha' } });
						return;
					}
				}

				const creationResult = await axios.post(`${config.apiBaseUrl}/user/create`, {
					screenName: req.body.screenName,
					password: req.body.password,
					name: req.body.name,
					description: req.body.description
				}, { headers: { authorization: `bearer ${config.hostToken.accessToken}` }, validateStatus: () => true });
				if (creationResult.status != 200 && (creationResult.status != 400 || creationResult.data.error.reason != 'duplicated_screen_name')) {
					log('failed to request /user/create');
					log('statusCode:', creationResult.status);
					log('data:', creationResult.data);
					res.status(500).json({ error: { reason: 'server_error' } });
					return;
				}
				if (creationResult.status == 400) {
					res.status(400).json({ error: { reason: 'duplicated_screen_name' } });
					return;
				}

				let tokenInfo: ITokenInfo | null;
				try {
					// for the first time only, fetch host token info
					if (!hostTokenInfo) {
						hostTokenInfo = await getTokenByAccessToken(config.hostToken.accessToken, configManager);
					}

					// get token
					tokenInfo = await getToken(creationResult.data.result.id, hostTokenInfo.appId, config.clientToken.scopes, configManager);

					// if token is not found, create a token
					if (!tokenInfo) {
						tokenInfo = await createToken(creationResult.data.result.id, hostTokenInfo.appId, config.clientToken.scopes, configManager);
					}
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

				res.status(200).json({
					user: creationResult.data.result,
					scopes: tokenInfo.scopes,
					accessToken: tokenInfo.accessToken
				});
			});

			app.post('/config', (req, res) => {
				// recaptcha
				const recaptcha: { [x: string]: any } = {
					enabled: config.recaptcha.enable
				};
				if (config.recaptcha.enable) {
					recaptcha.key = config.recaptcha.siteKey;
				}

				res.json({
					recaptcha: recaptcha
				});
			});
		});
	}

	return {
		name: 'webapp',
		init: init,
		handler: handler
	};
};
