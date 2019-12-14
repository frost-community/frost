import ActiveConfigManager from './ActiveConfigManager';

export const enum DataVersionState {
	ready,
	needInitialization,
	needMigration,
	unknown
}

interface IOptions {

}

/**
 * 保存されているデータバージョンの状態を確認します。
 *
 * APIのバージョンアップによって保存されるデータの構造が変更される場合があります。
 * 「データバージョン」は、正常に初期化・データ移行するために必要な識別子です。
*/
export default async function(activeConfigManager: ActiveConfigManager, dataVersion: number, dbDomain: string, options?: IOptions): Promise<DataVersionState> {
	options = options || { };

	let currentDataVersion = await activeConfigManager.getItem(dbDomain, 'dataVersion');

	if (currentDataVersion == null) {
		return DataVersionState.needInitialization;
	}

	if (currentDataVersion === dataVersion) {
		return DataVersionState.ready;
	}

	if (currentDataVersion < dataVersion) {
		return DataVersionState.needMigration;
	}

	return DataVersionState.unknown;
}
