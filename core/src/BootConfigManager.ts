import $ from 'cafy';
import uid from 'uid2';
import IBootConfig from './IBootConfig';
import fs from 'fs';
import { promisify } from 'util';
import inputLine from './inputLine';
import question from './question';

/**
 * provide methods to access server bootstrap config
*/
export default class BootConfigManager {
	static create(mongoUrl: string, dbName: string): IBootConfig {
		const config: IBootConfig = {
			cryptoKey: uid(128),
			mongo: {
				url: mongoUrl,
				dbName: dbName
			}
		};
		try {
			BootConfigManager.verify(config);
		}
		catch (err) {
			if (err instanceof Error && err.message == 'invalid boot config') {
				throw new Error('failed to verify boot config. please check if mongoUrl and dbName are valid.');
			}
			throw err;
		}
		return config;
	}

	static verify(config: IBootConfig): void {
		const verificationConfig = $.obj({
			cryptoKey: $.str,
			mongo: $.obj({
				url: $.str,
				dbName: $.str
			})
		});
		if (verificationConfig.nok(config)) {
			throw new Error('invalid boot config');
		}
	}

	static async write(config: IBootConfig, filePath: string): Promise<void> {
		await promisify(fs.writeFile)(filePath, JSON.stringify(config, null, 2));
	}

	static read(filePath: string): IBootConfig {
		const config: IBootConfig = require(filePath);
		BootConfigManager.verify(config);
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
		const config = BootConfigManager.create(mongoUrl, dbName);

		console.log('generated boot config:\n');
		console.log(JSON.stringify(config, null, 2));
		console.log('');

		const isGenerate = await question('are you sure you want to write to file boot-config.json? (y/n) > ');
		if (isGenerate) {
			await BootConfigManager.write(config, './.configs/boot-config.json');
			console.log('boot-config.json was generated.');
		}
	}
}
