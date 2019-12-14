import MongoProvider from './MongoProvider';

/**
 * provide methods to access config items in the database
*/
export default class ActiveConfigManager {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	private db: MongoProvider;

	async getItem(dbDomain: string, type: string): Promise<any | null> {
		const result = await this.db.find(`${dbDomain}.config`, { type: type });
		if (result == null || result.value == null) {
			return null;
		}
		return result.value;
	}

	async setItem(dbDomain: string, type: string, value: any): Promise<void> {
		await this.db.upsert(`${dbDomain}.config`, { type: type }, { type: type, value: value });
	}

	async removeItem(dbDomain: string, type: string): Promise<void> {
		await this.setItem(dbDomain, type, null);
	}
}
