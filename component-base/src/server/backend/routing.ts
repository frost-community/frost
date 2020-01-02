import $ from 'cafy';
import { ActiveConfigManager, IComponentBootApi } from 'frost-core';
import { BaseApi, HttpMethod } from '../../baseApi';
import log from '../../misc/log';
import UserService from '../services/UserService';
import TokenService from '../services/TokenService';
import { AppDocument, IAppDocument, UserDocument, TokenDocument } from '../misc/documents';

export default async function(ctx: IComponentBootApi, bootApi: BaseApi, activeConfigManager: ActiveConfigManager) {
	const userService = new UserService(ctx.db);
	const tokenService = new TokenService(ctx.db);

	// route: get session
	bootApi.http.route(HttpMethod.POST, '/session', async (req, res) => {
		try {
			const screenName: string = req.body.screenName;
			const password: string = req.body.password;

			const screenNameValidation = $.str.range(4, 15).match(/^[a-zA-Z0-9_-]+$/);
			const passwordValidation = $.str.min(8);
			if (screenNameValidation.nok(screenName) || passwordValidation.nok(password)) {
				res.status(400).json({ error: { reason: 'invalid_param' } });
				return;
			}

			// validate credential
			const userDoc = await userService.findByScreenName(screenName);
			if (!userDoc) {
				res.status(400).json({ error: { reason: 'invalid_credential' } });
				return;
			}
			const isValid = userDoc.validatePassword(password);
			if (!isValid) {
				res.status(400).json({ error: { reason: 'invalid_credential' } });
				return;
			}

			// find app
			const appDocRaw: IAppDocument = await ctx.db.find('base.apps', {
				root: true
			});
			if (!appDocRaw) {
				throw new Error('app notfound');
			}
			const appDoc = new AppDocument(appDocRaw);

			// get scopes of token
			const scopes: string[] = await activeConfigManager.getItem('base', 'clientToken.scopes');

			// find token
			let tokenDoc = await tokenService.find(appDoc._id, userDoc._id, scopes);
			if (!tokenDoc) {
				// create token
				tokenDoc = await tokenService.create(appDoc, userDoc, scopes);
			}

			res.status(200).json({
				user: await userDoc.pack(ctx.db),
				scopes: tokenDoc.scopes,
				accessToken: tokenDoc.accessToken
			});
		}
		catch (err) {
			log('BackendRouting:', err.message);
			res.status(500).json({ error: { reason: 'server_error' } });
		}
	});

	bootApi.http.route(HttpMethod.POST, '/session/register', async (req, res) => {
		try {
			const screenName: string = req.body.screenName;
			const password: string = req.body.password;

			const screenNameValidation = $.str.range(4, 15).match(/^[a-zA-Z0-9_-]+$/);
			const passwordValidation = $.str.min(8);
			if (screenNameValidation.nok(screenName) || passwordValidation.nok(password)) {
				res.status(400).json({ error: { reason: 'invalid_param' } });
				return;
			}

			// check the no ScreenName duplication
			if (await userService.findByScreenName(screenName)) {
				res.status(400).json({ error: { reason: 'screen_name_duplicated' } });
				return;
			}

			// find app
			const appDocRaw: IAppDocument = await ctx.db.find('base.apps', {
				root: true
			});
			if (!appDocRaw) {
				throw new Error('app notfound');
			}

			// create a user
			let userDoc: UserDocument;
			try {
				userDoc = await userService.create(screenName, password, '', '');
			}
			catch (err) {
				log('error:', err);
				throw new Error('failed to create user');
			}
			const user = await userDoc.pack(ctx.db);

			// get scopes of token
			const scopes: string[] = await activeConfigManager.getItem('base', 'clientToken.scopes');

			// create a token
			let tokenDoc: TokenDocument;
			try {
				tokenDoc = await tokenService.create(appDocRaw, userDoc, scopes);
			}
			catch (err) {
				log('error:', err);
				throw new Error('failed to create an token');
			}

			res.status(200).json({
				user: user,
				scopes: tokenDoc.scopes,
				accessToken: tokenDoc.accessToken
			});
		}
		catch (err) {
			log('BackendRouting:', err);
			res.status(500).json({ error: { reason: 'server_error' } });
		}
	});
}
