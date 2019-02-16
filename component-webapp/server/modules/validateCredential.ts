import $ from 'cafy';
import axios from 'axios';
import { HttpError } from './errors';
import log from './log';
import { ActiveConfigManager } from 'frost-core';

export interface IValidResult {
	isValid: true;
	userId: string;
}

export interface IInvalidResult {
	isValid: false;
}

export default async function(screenName: string, password: string, activeConfigManager: ActiveConfigManager): Promise<IValidResult | IInvalidResult> {
	const apiBaseUrl = await activeConfigManager.getItem('webapp', 'apiBaseUrl');
	const hostAccessToken = await activeConfigManager.getItem('webapp', 'hostToken.accessToken');

	if ($.str.nok(screenName) || $.str.nok(password)) {
		throw new HttpError(400, { error: { reason: 'invalid_param' } });
	}
	// * validate credential
	const validation = await axios.post(`${apiBaseUrl}/auth/credential/validate`, {
		screenName: screenName,
		password: password
	}, { headers: { authorization: `bearer ${hostAccessToken}` }, validateStatus: () => true });
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
