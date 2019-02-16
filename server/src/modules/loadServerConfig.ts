import $ from 'cafy';
import { ActiveConfigManager } from 'frost-core';
import log from './log';

export interface IServerConfig {
	httpPort?: number,
	enableApi: boolean,
	enableWebApp: boolean
}

/**
 * load server config.
*/
export default async function(activeConfigManager: ActiveConfigManager): Promise<IServerConfig> {

	log('loading server config ...');
	const serverConfig: IServerConfig = {
		httpPort: await activeConfigManager.getItem('server', 'httpPort'),
		enableApi: await activeConfigManager.getItem('server', 'enableApi'),
		enableWebApp: await activeConfigManager.getItem('server', 'enableWebApp')
	};

	try {
		verifyConfig(serverConfig);
		log('loaded server config.');
	}
	catch {
		throw new Error('server is not configured. please configure on the server setting menu.');
	}

	loadEnvVariables(serverConfig);
	if (!serverConfig.httpPort) {
		throw new Error('httpPort is not configured');
	}

	return serverConfig;
}

function verifyConfig(config: IServerConfig): void {
	// verify server config
	const verificationServerConfig = $.obj({
		httpPort: $.num.optional.nullable,
		enableApi: $.bool,
		enableWebApp: $.bool
	});
	if (verificationServerConfig.nok(config)) {
		throw new Error('invalid server config');
	}
};

function loadEnvVariables(config: IServerConfig) {
	// PORT env variable
	if (process.env.PORT != null) {
		const parsed = parseInt(process.env.PORT);
		if (Number.isNaN(parsed)) {
			throw new Error('PORT env variable is invalid value');
		}
		config.httpPort = parsed;
	}
}
