import path from 'path';
import { PatchApi } from 'frost-migration';
import IApiConfig from '../IApiConfig';
import { ActiveConfigManager } from 'frost-core';

export default function(patchApi: PatchApi) {
	patchApi.define({
		from: 1,
		to: 2
	}, async (db) => {
		// (rename collection) meta -> api.meta
		await db.rename('meta', 'api.meta');
		await db.update('api.meta', { type: 'dataFormat' }, { type: 'dataFormat', value: 2 });

		let apiConfig;
		try {
			if (process.env.FROST_API != null) {
				apiConfig = JSON.parse(process.env.FROST_API) as IApiConfig;
			}
			else {
				apiConfig = require(path.resolve(process.cwd(), './.configs/api-config.json')) as IApiConfig;
			}
		}
		catch (err) {
			apiConfig = undefined;
		}

		if (apiConfig) {
			console.log('migrating api config ...');
			const activeConfigManager = new ActiveConfigManager(db);
			await activeConfigManager.setItem('api', 'appSecretKey', apiConfig.appSecretKey);
			await activeConfigManager.setItem('api', 'hostToken.scopes', apiConfig.hostToken.scopes);
			console.log('migrated api config.');
		}
	});
}
