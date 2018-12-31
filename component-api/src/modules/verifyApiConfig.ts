import $ from 'cafy';
import IApiConfig from "./IApiConfig";

export default (config: IApiConfig): void => {

	// verify api config
	const verificationConfig = $.obj({
	});
	if (verificationConfig.nok(config)) {
		throw new Error('invalid api config');
	}

};
