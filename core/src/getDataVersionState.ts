import MongoProvider from './MongoProvider';

export const enum DataVersionState {
	ready,
	needInitialization,
	needMigration,
	unknown
}

interface IGetDataVersionStateOptions {
	enableOldMetaCollection: boolean;
}

/**
 * 保存されているデータバージョンの状態を確認します。
 *
 * APIのバージョンアップによって保存されるデータの構造が変更される場合があります。
 * 「データバージョン」は、正常に初期化・データ移行するために必要な識別子です。
*/
export default async function(db: MongoProvider, targetDataVersion: number, metaCollection: string, collections: string[], options?: IGetDataVersionStateOptions): Promise<DataVersionState> {
	options = options || { enableOldMetaCollection: false };

	let dataVersion = await db.find(metaCollection, { type: 'dataFormat' });

	// NOTE: this code is left behind for backward compatibility. in the future it will be removed.
	if (!dataVersion) {
		dataVersion = await db.find('meta', { type: 'dataFormat' });
	}

	let docCount = 0;
	for (const collection of collections) {
		docCount += await db.count(collection, {});
	}

	// if the dataVersion is not saved
	if (!dataVersion) {
		if (docCount == 0) {
			return DataVersionState.needInitialization;
		}
		else {
			return DataVersionState.needMigration;
		}
	}

	// if the dataVersion is matched
	if (dataVersion.value === targetDataVersion) {
		return DataVersionState.ready;
	}

	// if the dataVersion was one of expected versions
	if (dataVersion.value < targetDataVersion) {
		return DataVersionState.needMigration;
	}
	else {
		return DataVersionState.unknown;
	}
}
