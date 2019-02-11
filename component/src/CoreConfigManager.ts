import $ from 'cafy';
import uid from 'uid2';
import ICoreConfig from './ICoreConfig';
import fs from 'fs';
import { promisify } from 'util';
import inputLine from './inputLine';

const question = async (str: string) => (await inputLine(str)).toLowerCase().indexOf('y') === 0;

export default class CoreConfigManager {
	static create(mongoUrl: string, dbName: string): ICoreConfig {
		const config: ICoreConfig = {
			cryptoKey: uid(128),
			mongo: {
				url: mongoUrl,
				dbName: dbName
			}
		};
		try {
			CoreConfigManager.verify(config);
		}
		catch (err) {
			if (err instanceof Error && err.message == 'invalid core config') {
				throw new Error('failed to verify core config. please check if mongoUrl and dbName are valid.');
			}
			throw err;
		}
		return config;
	}

	static verify(config: ICoreConfig): void {
		const verificationConfig = $.obj({
			cryptoKey: $.str,
			mongo: $.obj({
				url: $.str,
				dbName: $.str
			})
		});
		if (verificationConfig.nok(config)) {
			throw new Error('invalid core config');
		}
	}

	static async write(config: ICoreConfig, filePath: string): Promise<void> {
		await promisify(fs.writeFile)(filePath, JSON.stringify(config, null, 2));
	}

	static read(filePath: string): ICoreConfig {
		const config: ICoreConfig = require(filePath);
		CoreConfigManager.verify(config);
		return config;
	}

	static async showInit() {

		let mongoUrl: string, dbName: string;
		while(true) {
			mongoUrl = await inputLine('please set your MongoDB url (without db name) > ');
			dbName = await inputLine('please set your db name > ');

			if (await question('is this ok? (y/n) > ')) {
				break;
			}
		}
		const config = CoreConfigManager.create(mongoUrl, dbName);

		console.log('generated core config:\n');
		console.log(JSON.stringify(config, null, 2));
		console.log('');

		const isGenerate = await question('are you sure you want to write to file core-config.json? (y/n) > ');
		if (isGenerate) {
			await CoreConfigManager.write(config, './.configs/core-config.json');
			console.log('core-config.json was generated.');
		}
	}
}
