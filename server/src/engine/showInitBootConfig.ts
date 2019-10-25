import { question, inputLine, BootConfigManager } from 'frost-core';

export default async function showInitBootConfig() {
	let mongoUrl: string, dbName: string, httpPort: number | undefined;
	while(true) {
		// mongo url
		mongoUrl = await inputLine('please set your MongoDB url (without db name) > ');

		// mongo db name
		dbName = await inputLine('please set your db name > ');

		// http port
		const isSetHttpPort = await question('do you set the httpPort? (y/n) > ');
		if (isSetHttpPort) {
			httpPort = parseInt(await inputLine('please input your httpPort > '));
			if (Number.isNaN(httpPort)) {
				console.log('httpPort is invalid value');
				return;
			}
		}
		else {
			httpPort = undefined;
		}

		if (await question('is this ok? (y/n) > ')) {
			break;
		}
	}
	const config = BootConfigManager.create(mongoUrl, dbName, ['frost-component-base'], httpPort);

	console.log('generated boot config:\n');
	console.log(JSON.stringify(config, null, 2));
	console.log('\n');
	console.log('please set this one to your FROST_BOOT env variable or boot-config.json\n');

	const isGenerate = await question('are you sure you want to write to file boot-config.json? (y/n) > ');
	if (isGenerate) {
		await BootConfigManager.write(config, '../.configs/boot-config.json');
		console.log('boot-config.json was generated.');
	}
}
