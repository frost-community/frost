import $ from 'cafy';
import IWebAppConfig from "./IWebAppConfig";

export default (config: IWebAppConfig): void => {

	// verify webapp config
	const verificationConfig = $.obj({
	});
	if (verificationConfig.nok(config)) {
		throw new Error('invalid webapp config');
	}

};
