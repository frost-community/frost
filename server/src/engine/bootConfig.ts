import $ from 'cafy';
import { promises as fs } from 'fs';

export interface IBootConfig {
	mongo: {
		url: string;
		dbName: string;
	};
}

/**
 * provide methods to access server bootstrap config
*/
export class BootConfigManager {
	static create(mongoUrl: string, dbName: string): IBootConfig {
		const config: IBootConfig = {
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
		await fs.writeFile(filePath, JSON.stringify(config, null, 2));
	}

	static read(filePath: string): IBootConfig {
		const config: IBootConfig = require(filePath);
		BootConfigManager.verify(config);
		return config;
	}
}
