import $ from 'cafy';
import IConfig from "../IConfig";

export default (config: IConfig): void => {

	// verify config
	if ($.obj().nok(config)) {
		throw new Error('[server]invalid config');
	}

	// verify config.server
	const verificationServerConfig = $.obj({
		httpPort: $.num,
		mongo: $.obj({
			url: $.str,
			dbName: $.str
		})
	});
	if (verificationServerConfig.nok(config.server)) {
		throw new Error('[server]invalid config.server');
	}

	// verify config.api
	const verificationApiConfig = $.obj({
		enable: $.bool
	});
	if (verificationApiConfig.nok(config.api)) {
		throw new Error('[server]invalid config.api');
	}

	// verify config.webapp
	const verificationWebAppConfig = $.obj({
		enable: $.bool
	});
	if (verificationWebAppConfig.nok(config.webapp)) {
		throw new Error('[server]invalid config.webapp');
	}

};
