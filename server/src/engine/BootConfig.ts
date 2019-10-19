import $ from 'cafy';
import randomstring from 'randomstring';
import { promises as fs } from 'fs';
import { question, inputLine } from 'frost-core';

export interface IBootConfig {
	cryptoKey: string;
	mongo: {
		url: string;
		dbName: string;
	};
	httpPort?: number;
	usingComponents: string[];
}

/**
 * provide methods to access server bootstrap config
*/
export class BootConfigManager {
	static create(mongoUrl: string, dbName: string, components: string[] = ['frost-component-base'], httpPort?: number): IBootConfig {
		const config: IBootConfig = {
			cryptoKey: randomstring.generate({ length: 128 }),
			mongo: {
				url: mongoUrl,
				dbName: dbName
			},
			httpPort: httpPort,
			usingComponents: components
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
			}),
			httpPort: $.number.nullable.optional,
			usingComponents: $.array($.str)
		});
		if (verificationConfig.nok(config)) {
			throw new Error('invalid boot config');
		}
	}

	static async write(config: IBootConfig, filePath: string): Promise<void> {
		await fs.writeFile(filePath, JSON.stringify(config, null, 2));
	}

	static read(filePath: string): IBootConfig {
		const config: IBootConfig = require(filePath);
		BootConfigManager.verify(config);
		return config;
	}

	static async showInit() {

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
}
