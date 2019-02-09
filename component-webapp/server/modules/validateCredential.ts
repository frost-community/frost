import $ from 'cafy';
import axios from 'axios';
import { HttpError } from './errors';
import IWebAppConfig from './IWebAppConfig';
import log from './log';

export interface IValidResult {
	isValid: true;
	userId: string;
}

export interface IInvalidResult {
	isValid: false;
}

export default async function(screenName: string, password: string, config: IWebAppConfig): Promise<IValidResult | IInvalidResult> {
	if ($.str.nok(screenName) || $.str.nok(password)) {
		throw new HttpError(400, { error: { reason: 'invalid_param' } });
	}
	// * validate credential
	const validation = await axios.post(`${config.apiBaseUrl}/auth/credential/validate`, {
		screenName: screenName,
		password: password
	}, { headers: { authorization: `bearer ${config.hostToken.accessToken}` }, validateStatus: () => true });
	// expect: status 200 or error invalid_param_format
	if (validation.status != 200 && (validation.status != 400 || validation.data.error.reason != 'invalid_param_format')) {
		log('failed to request /auth/credential/validate');
		log('statusCode:', validation.status);
		log('data:', validation.data);
		throw new HttpError(500, { error: { reason: 'server_error' } });
	}
	if (validation.status == 400) {
		return {
			isValid: false
		};
	}
	return {
		isValid: validation.data.result.isValid,
		userId: validation.data.result.userId
	};
}
