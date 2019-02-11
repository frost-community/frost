import axios from 'axios';
import { HttpError } from './errors';
import log from './log';
import { ConfigManager } from 'frost-core';

export interface ITokenInfo {
	appId: string,
	userId: string,
	scopes: string[],
	accessToken: string
};

export default async function(accessToken: string, configManager: ConfigManager): Promise<ITokenInfo> {
	const apiBaseUrl = await configManager.getItem('webapp', 'apiBaseUrl');
	const hostAccessToken = await configManager.getItem('webapp', 'hostToken.accessToken');

	const tokenResult = await axios.post(`${apiBaseUrl}/auth/token/get`, {
		accessToken: accessToken
	}, { headers: { authorization: `bearer ${hostAccessToken}` }, validateStatus: () => true });
	// expect: status 200 or error token_not_found
	if (tokenResult.status != 200 && (tokenResult.status != 400 || tokenResult.data.error.reason != 'token_not_found')) {
		log('failed to request /auth/token/get');
		log('statusCode:', tokenResult.status);
		log('data:', tokenResult.data);
		throw new HttpError(500, { error: { reason: 'server_error' } });
	}

	return {
		appId: tokenResult.data.result.appId,
		userId: tokenResult.data.result.userId,
		scopes: tokenResult.data.result.scopes,
		accessToken: tokenResult.data.result.accessToken
	};
}
