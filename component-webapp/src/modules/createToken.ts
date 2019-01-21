import axios, { AxiosResponse } from 'axios';
import IWebAppConfig from './IWebAppConfig';
import { HttpError } from './errors';
import log from './log';

export interface ITokenInfo {
	appId: string,
	userId: string,
	scopes: string[],
	accessToken: string
};

export default async function(userId: string, appId: string, scopes: string[], config: IWebAppConfig): Promise<ITokenInfo> {
	const tokenResult = await axios.post(`${config.apiBaseUrl}/auth/token/create`, {
		appId: appId,
		userId: userId,
		scopes: scopes
	}, { headers: { authorization: `bearer ${config.hostToken.accessToken}` }, validateStatus: () => true });
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
