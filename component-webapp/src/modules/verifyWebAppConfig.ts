import $ from 'cafy';
import IWebAppConfig from "./IWebAppConfig";

export default (config: IWebAppConfig): void => {

	// verify webapp config
	const verificationConfig = $.obj({
		apiBaseUrl: $.str,
		hostToken: $.obj({
			accessToken: $.str
		}),
		clientToken: $.obj({
			scopes: $.array($.str).unique()
		})
	});
	if (verificationConfig.nok(config)) {
		throw new Error('invalid webapp config');
	}

};
