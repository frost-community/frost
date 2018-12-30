export interface IAuthScope {
	id: string;
	grantable: boolean;
}

export class AuthScopes {
	/** 認可付与のホスト権限 */
	static authHost: IAuthScope = { id: 'auth.host', grantable: false };
	/** 連携アプリの作成操作 */
	static appCreate: IAuthScope = { id: 'app.create', grantable: false };
	/** 連携アプリの読み取り操作 */
	static appRead: IAuthScope = { id: 'app.read', grantable: true };
	/** 連携アプリの書き換え操作 */
	static appWrite: IAuthScope = { id: 'app.write', grantable: true };
	/** 連携アプリのホスト権限 */
	static appHost: IAuthScope = { id: 'app.host', grantable: false };
	/** ユーザー情報の作成 */
	static userCreate: IAuthScope = { id: 'user.create', grantable: false };
	/** ユーザー情報の取得 */
	static userRead: IAuthScope = { id: 'user.read', grantable: true };
	/** ユーザー情報の書き換え */
	static userWrite: IAuthScope = { id: 'user.write', grantable: true };
	/** ユーザー情報の削除 */
	static userDelete: IAuthScope = { id: 'user.delete', grantable: false };
	/** アカウントの非公開情報等の取得 */
	static userAccountRead: IAuthScope = { id: 'user.account.read', grantable: true };
	/** アカウントの非公開情報等の書き換え */
	static userAccountWrite: IAuthScope = { id: 'user.account.write', grantable: true };
	/** 投稿やリアクションの取得 */
	static postingRead: IAuthScope = { id: 'post.read', grantable: true };
	/** 投稿やリアクションの作成・削除・書き換えの操作 */
	static postingWrite: IAuthScope = { id: 'post.write', grantable: true };
	/** ストレージへの読み取り操作 */
	static storageRead: IAuthScope = { id: 'storage.read', grantable: true };
	/** ストレージへの書き換え操作 */
	static storageWrite: IAuthScope = { id: 'storage.write', grantable: true };
}
