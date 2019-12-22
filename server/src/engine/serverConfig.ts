//
// The server config is an ActiveConfig for the frost-server.
//

import $ from 'cafy';
import { ActiveConfigManager } from 'frost-core';

export interface IServerConfig {
	dataVersion: number;
	components: string[];
}

export function isServerConfig(config: any): config is IServerConfig {
	// verify config
	const verificationConfig = $.obj({
		dataVersion: $.number,
		components: $.array($.str).unique()
	});
	return verificationConfig.ok(config);
};

export async function loadServerConfig(activeConfigManager: ActiveConfigManager): Promise<IServerConfig> {
	const [
		config_dataVersion,
		config_components
	] = await Promise.all([
		activeConfigManager.getItem('server', 'dataVersion'),
		activeConfigManager.getItem('server', 'components')
	]);

	const config: IServerConfig = {
		dataVersion: config_dataVersion,
		components: config_components
	};

	if (!isServerConfig(config)) {
		throw new Error('failed to load the server config');
	}

	return config;
}
