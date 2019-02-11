import axios from 'axios';
import { HttpError } from './errors';
import log from './log';
import { ConfigManager } from 'frost-component';

export interface ITokenInfo {
	appId: string,
	userId: string,
	scopes: string[],
	accessToken: string
};

export default async function(userId: string, appId: string, scopes: string[], configManager: ConfigManager): Promise<ITokenInfo> {
	const apiBaseUrl = await configManager.getItem('webapp', 'apiBaseUrl');
	const hostAccessToken = await configManager.getItem('webapp', 'hostToken.accessToken');

	const tokenResult = await axios.post(`${apiBaseUrl}/auth/token/create`, {
		appId: appId,
		userId: userId,
		scopes: scopes
	}, { headers: { authorization: `bearer ${hostAccessToken}` }, validateStatus: () => true });
	if (tokenResult.status != 200) {
		log('failed to request /auth/token/create');
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
