import path from 'path';
import { PatchApi } from 'frost-migration';
import { ActiveConfigManager } from 'frost-core';
import IWebAppConfig from '../IWebAppConfig';

export default function(patchApi: PatchApi) {

	patchApi.define({
		from: 1,
		to: 2
	}, async (db) => {

		let webappConfig;
		try {
			if (process.env.FROST_WEBAPP != null) {
				webappConfig = JSON.parse(process.env.FROST_WEBAPP) as IWebAppConfig;
			}
			else {
				webappConfig = require(path.resolve(process.cwd(), './.configs/webapp-config.json')) as IWebAppConfig;
			}
		}
		catch (err) {
			webappConfig = undefined;
		}

		if (webappConfig) {
			console.log('migrating webapp config ...');
			const activeConfigManager = new ActiveConfigManager(db);
			await activeConfigManager.setItem('webapp', 'apiBaseUrl', webappConfig.apiBaseUrl);
			await activeConfigManager.setItem('webapp', 'hostToken.accessToken', webappConfig.hostToken.accessToken);
			await activeConfigManager.setItem('webapp', 'clientToken.scopes', webappConfig.clientToken.scopes);
			await activeConfigManager.setItem('webapp', 'recaptcha.enable', webappConfig.recaptcha.enable);
			await activeConfigManager.setItem('webapp', 'recaptcha.siteKey', webappConfig.recaptcha.siteKey);
			await activeConfigManager.setItem('webapp', 'recaptcha.secretKey', webappConfig.recaptcha.secretKey);
			console.log('migrated webapp config.');
		}

		await db.update('webapp.meta', { type: 'dataFormat' }, { type: 'dataFormat', value: 2 });
	});

}
