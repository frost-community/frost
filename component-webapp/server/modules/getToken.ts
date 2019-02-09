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

export default async function(userId: string, appId: string, scopes: string[], config: IWebAppConfig): Promise<ITokenInfo | null> {

	let tokenResult: AxiosResponse<any>;
	tokenResult = await axios.post(`${config.apiBaseUrl}/auth/token/get`, {
		appId: appId,
		userId: userId,
		scopes: scopes
	}, { headers: { authorization: `bearer ${config.hostToken.accessToken}` }, validateStatus: () => true });
	// expect: status 200 or error token_not_found
	if (tokenResult.status != 200 && (tokenResult.status != 400 || tokenResult.data.error.reason != 'token_not_found')) {
		log('failed to request /auth/token/get');
		log('statusCode:', tokenResult.status);
		log('data:', tokenResult.data);
		throw new HttpError(500, { error: { reason: 'server_error' } });
	}

	if (tokenResult.status == 400) {
		return null;
	}

	return {
		appId: tokenResult.data.result.appId,
		userId: tokenResult.data.result.userId,
		scopes: tokenResult.data.result.scopes,
		accessToken: tokenResult.data.result.accessToken
	};
}
