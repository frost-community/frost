import { MongoProvider } from 'frost-core';

export const enum DataFormatState {
	ready,
	needInitialization,
	needMigration,
	unknown
}

/**
 * 保存されているデータフォーマットを確認します。
 *
 * APIのバージョンアップによって保存されるデータの構造が変更される場合があります。
 * 「データフォーマット」は、正常に初期化・データ移行するために必要な識別子です。
*/
export default async function(db: MongoProvider, currentVersion: number): Promise<DataFormatState> {
	const dataFormat = await db.find('webapp.meta', { type: 'dataFormat' });

	let docCount = 0;
	/*
	docCount += await db.count('webapp.abc', {});
	*/

	// データフォーマットが保存されていないとき
	if (!dataFormat) {
		if (docCount == 0) {
			return DataFormatState.needInitialization;
		}
		else {
			return DataFormatState.needMigration;
		}
	}

	// データフォーマットが一致しているとき
	if (dataFormat.value === currentVersion) {
		return DataFormatState.ready;
	}

	// データフォーマットが期待したものであるとき
	if (dataFormat.value < currentVersion) {
		return DataFormatState.needMigration;
	}
	else {
		return DataFormatState.unknown;
	}
}
