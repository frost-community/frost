import $ from 'cafy';
import IApiConfig from "./IApiConfig";
import { AuthScopes } from './authScope';

export default (config: IApiConfig): void => {

	const allScopes = AuthScopes.toArray();

	// verify api config
	const verificationConfig = $.obj({
		appSecretKey: $.str,
		hostToken: $.obj({
			scopes: $.array($.str.pipe(scope => allScopes.find(s => s.id == scope) != null)).unique()
		})
	});
	if (verificationConfig.nok(config)) {
		throw new Error('invalid api config');
	}

};
