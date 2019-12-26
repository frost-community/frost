import $ from 'cafy';
import { AuthScopes } from '../api/misc/authScope';
import { ActiveConfigManager } from 'frost-core';

export interface IBaseConfig {
	dataVersion: number;
	httpPort: number;
	appSecretKey: string;
	clientToken: {
		scopes: string[];
	};
	hostToken: {
		scopes: string[];
		accessToken: string;
	};
	recaptcha: {
		enable: boolean;
		siteKey: string;
		secretKey: string;
	};
}

export function isBaseConfig(config: any): config is IBaseConfig {
	const allScopes = AuthScopes.toArray();

	// verify api config
	const verificationConfig = $.obj({
		dataVersion: $.number,
		httpPort: $.number,
		appSecretKey: $.str,
		clientToken: $.obj({
			scopes: $.array($.str.pipe(scope => allScopes.find(s => s.id == scope) != null)).unique()
		}),
		hostToken: $.obj({
			scopes: $.array($.str.pipe(scope => allScopes.find(s => s.id == scope) != null)).unique(),
			accessToken: $.str,
		}),
		recaptcha: $.obj({
			enable: $.boolean,
			siteKey: $.str,
			secretKey: $.str
		})
	});
	return verificationConfig.ok(config);
};

export async function loadBaseConfig(activeConfigManager: ActiveConfigManager): Promise<IBaseConfig | undefined> {
	const [
		config_dataVersion,
		config_httpPort,
		config_appSecretKey,
		config_clientToken_scopes,
		config_hostToken_scopes,
		config_hostToken_accessToken,
		config_recaptcha_enable,
		config_recaptcha_siteKey,
		config_recaptcha_secretKey
	] = await Promise.all([
		activeConfigManager.getItem('base', 'dataVersion'),
		activeConfigManager.getItem('base', 'httpPort'),
		activeConfigManager.getItem('base', 'appSecretKey'),
		activeConfigManager.getItem('base', 'clientToken.scopes'),
		activeConfigManager.getItem('base', 'hostToken.scopes'),
		activeConfigManager.getItem('base', 'hostToken.accessToken'),
		activeConfigManager.getItem('base', 'recaptcha.enable'),
		activeConfigManager.getItem('base', 'recaptcha.siteKey'),
		activeConfigManager.getItem('base', 'recaptcha.secretKey')
	]);

	const config: IBaseConfig = {
		dataVersion: config_dataVersion,
		httpPort: config_httpPort,
		appSecretKey: config_appSecretKey,
		clientToken: {
			scopes: config_clientToken_scopes
		},
		hostToken: {
			scopes: config_hostToken_scopes,
			accessToken: config_hostToken_accessToken
		},
		recaptcha: {
			enable: config_recaptcha_enable,
			siteKey: config_recaptcha_siteKey,
			secretKey: config_recaptcha_secretKey
		}
	};

	if (!isBaseConfig(config)) {
		return undefined;
	}

	return config;
}
