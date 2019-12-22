import path from 'path';
import { question, inputLine, MongoProvider, ActiveConfigManager } from 'frost-core';
import { BootConfigManager } from './bootConfig';
import { meta } from './ServerEngine';
import { IServerConfig } from './serverConfig';

export default async function() {
	let mongoUrl: string, dbName: string;
	while(true) {
		// mongo url
		mongoUrl = await inputLine('please set your MongoDB url (without db name) > ');

		// mongo db name
		dbName = await inputLine('please set your db name > ');

		if (await question('is this ok? (y/n) > ')) {
			break;
		}
	}
	const config = BootConfigManager.create(mongoUrl, dbName);

	console.log('generated boot config:\n');
	console.log(JSON.stringify(config, null, 2));
	console.log('\n');
	console.log('please set this one to your FROST_BOOT env variable or boot-config.json\n');

	const isGenerate = await question('are you sure you want to write to file boot-config.json? (y/n) > ');
	if (isGenerate) {
		await BootConfigManager.write(config, path.join(process.cwd(), '.configs/boot-config.json'));
		console.log('boot-config.json was generated.');
	}

	// database connection
	console.log('connecting db ...');
	const db = await MongoProvider.connect(config.mongo.url, config.mongo.dbName);
	console.log('connected db.');

	try {
		const activeConfigManager = new ActiveConfigManager(db);

		// server config
		console.log('saving the server config ...');
		const serverConfig: IServerConfig = {
			dataVersion: meta.dataVersion,
			components: ['frost-component-base']
		};
		await activeConfigManager.setItem('server', 'dataVersion', serverConfig.dataVersion);
		await activeConfigManager.setItem('server', 'components', serverConfig.components);
		console.log('saved the server config.');
	}
	finally {
		await db.disconnect();
	}
}
