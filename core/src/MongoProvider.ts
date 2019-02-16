import {
	MongoClient, ObjectId, Db, FilterQuery, UpdateManyOptions, UpdateOneOptions,
	CommonOptions as MongoCommonOptions, WriteOpResult
} from 'mongodb';

interface IFindArrayOptions {
	isAscending?: boolean;
	limit?: number;
	since?: ObjectId;
	until?: ObjectId;
}

/**
 * provide methods to access MongoDB
*/
export default class MongoProvider {
	constructor(client: MongoClient, dbName: string) {
		this.client = client;
		this.db = client.db(dbName);
	}

	private client: MongoClient;

	private db: Db;

	async create(collectionName: string, data: { [x: string]: any }): Promise<any> {
		const result = await this.db.collection(collectionName).insertOne(data);
		const document = await this.find(collectionName, { _id: result.ops[0]._id });

		return document;
	}

	/**
	 * ドキュメントを検索して1つの項目を取得します
	*/
	find(collectionName: string, query: { [x: string]: any }, options?: { [x: string]: any }): Promise<any> {
		return this.db.collection(collectionName).findOne(query, options);
	}

	/**
	 * ドキュメントIDによりドキュメントを検索して1つの項目を取得します
	*/
	findById(collectionName: string, id: string | ObjectId, options?: { [x: string]: any }): Promise<any> {
		return this.find(collectionName, { _id: MongoProvider.buildId(id) }, options);
	}

	/**
	 * ドキュメントを検索して複数の項目を取得します
	*/
	async findArray(collectionName: string, query: { [x: string]: any }, options?: IFindArrayOptions): Promise<any[]> {
		options = options || {};

		if (options.since != null || options.until != null) {
			query._id = {};
		}
		if (options.since != null) {
			query._id.$gt = options.since;
		}
		if (options.until != null) {
			query._id.$lt = options.until;
		}

		let cursor = this.db.collection(collectionName).find(query);

		if (options.limit != null)
			cursor = cursor.limit(options.limit);

		if (options.isAscending != null)
			cursor = cursor.sort(MongoProvider.buildSortOption(options.isAscending));

		const documents = await cursor.toArray();

		return documents;
	}

	/**
	 * クエリに一致するドキュメントの個数を取得します
	*/
	async count(collectionName: string, query: { [x: string]: any }): Promise<number> {
		return this.db.collection(collectionName).countDocuments(query);
	}

	/**
	 * ドキュメントを更新します
	*/
	async update(collectionName: string, query: FilterQuery<any>, data: { [x: string]: any }, options?: UpdateOneOptions & { renewal?: boolean }): Promise<any> {
		if (options == null) options = {};

		const result = await this.db.collection(collectionName).updateOne(query, options.renewal ? data : { $set: data }, options);

		if (result.result.ok != 1) {
			throw new Error('failed to update a database document');
		}

		const document = await this.find(collectionName, query);

		return document;
	}

	async updateMany(collectionName: string, query: FilterQuery<any>, data: { [x: string]: any }, options?: UpdateManyOptions & { renewal?: boolean }) {
		if (options == null) options = {};
		//options.renewal = options.renewal || false;

		const result = await this.db.collection(collectionName).updateMany(query, options.renewal ? data : { $set: data }, options);

		if (result.result.ok != 1) {
			throw new Error('failed to update some database documents');
		}

		const documents = await this.findArray(collectionName, query);

		return documents;
	}

	updateById(collectionName: string, id: string | ObjectId, data: { [x: string]: any }, options?: UpdateOneOptions & { renewal?: boolean }) {
		return this.update(collectionName, { _id: MongoProvider.buildId(id) }, data, options);
	}

	upsert(collectionName: string, query: FilterQuery<any>, data: { [x: string]: any }, options?: UpdateOneOptions & { renewal?: boolean }) {
		if (options == null)
			options = {};

		options.upsert = true;

		return this.update(collectionName, query, data, options);
	}

	/**
	 * ドキュメントを削除します
	 *
	 * @param {string} collectionName
	 * @param {Object} query
	 * @param {Object} options
	 * @return {Promise<void>}
	*/
	async remove(collectionName: string, query: { [x: string]: any }, options?: MongoCommonOptions & { single?: boolean }): Promise<WriteOpResult> {
		return await this.db.collection(collectionName).remove(query, options);
	}

	removeById(collectionName: string, id: string | ObjectId, options?: MongoCommonOptions & { single?: boolean }): Promise<WriteOpResult> {
		if (options == null) options = {};

		return this.remove(collectionName, { _id: MongoProvider.buildId(id) }, options);
	}

	async drop(collectionName: string): Promise<void> {
		await this.db.collection(collectionName).drop();
	}

	async rename(collectionName: string, newcollectionName: string) {
		await this.db.collection(collectionName).rename(newcollectionName);
	}

	disconnect(): Promise<void> {
		return this.client.close();
	}

	/**
	 * MongoDBに接続します
	*/
	static async connect(url: string, dbname: string): Promise<MongoProvider> {
		// remove last char
		if (url[url.length - 1] == '/') {
			url.substr(0, url.length - 1);
		}

		const client = await MongoClient.connect(`${url}/${dbname}`, { useNewUrlParser: true });

		return new MongoProvider(client, dbname);
	}

	static buildId(idSource: string | ObjectId): ObjectId {
		return new ObjectId(idSource);
	}

	static stringifyId(id: ObjectId): string {
		return id.toHexString();
	}

	static validateId(id: any): boolean {
		return ObjectId.isValid(id);
	}

	private static buildSortOption(isAscending: boolean): { $natural: 1 | -1 } {
		return { $natural: (isAscending ? 1 : -1) };
	}
}
