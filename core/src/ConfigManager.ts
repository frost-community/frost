import MongoProvider from './MongoProvider';

export default class ConfigManager {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	private db: MongoProvider;

	async getItem(configDomain: string, type: string) {
		const result = await this.db.find(`${configDomain}.config`, { type: type });
		if (!result || !result.value) {
			return null;
		}
		return result.value;
	}

	async setItem(configDomain: string, type: string, value: any) {
		await this.db.upsert(`${configDomain}.config`, { type: type }, { type: type, value: value });
	}

	async removeItem(configDomain: string, type: string) {
		await this.setItem(configDomain, type, null);
	}
}
