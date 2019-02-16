import { BootConfigManager, IBootConfig, MongoProvider, ActiveConfigManager } from 'frost-core';
import log from './log';

/**
 * initialize server.
 * if boot config is loaded, return various server data.
*/
export default async function() {

	let bootConfig: IBootConfig | undefined;
	log('loading boot config ...');
	try {
		if (process.env.FROST_BOOT != null) {
			log(`loading boot config from FROST_BOOT env variable ...`);
			bootConfig = JSON.parse(process.env.FROST_BOOT) as IBootConfig;
		}
		else {
			log(`loading boot config from boot-config.json ...`);
			bootConfig = require(`../.configs/boot-config.json`) as IBootConfig;
		}
		BootConfigManager.verify(bootConfig);
		log('loaded boot config.');
	}
	catch (err) {
		bootConfig = undefined;
		log('valid boot config was not found.');
	}

	let db: MongoProvider | undefined;
	let activeConfigManager: ActiveConfigManager | undefined;
	if (bootConfig) {
		log('connecting db ...');
		db = await MongoProvider.connect(bootConfig.mongo.url, bootConfig.mongo.dbName);
		log('connected db.');
		activeConfigManager = new ActiveConfigManager(db);

		return {
			bootConfig,
			db,
			activeConfigManager
		};
	}

	return undefined;
}
