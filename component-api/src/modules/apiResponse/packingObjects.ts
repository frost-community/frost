/*
	レスポンスとしてパックされるデータオブジェクトを定義します
*/

export interface IUser {
	id: string;
	createdAt: string;
	screenName: string;
	name: string;
	description: string;
	followingsCount: number;
	followersCount: number;
	postingsCount: {
		chat?: number;
	};
}

export interface IUserRelation {
	sourceUserId: string;
	targetUserId: string;
	status: 'following' | 'notFollowing';
	message?: string;
}

export interface IPosting {
	id: string;
	createdAt: string;
	type: string;
	user: IUser;
}

export interface IChatPosting extends IPosting {
	text: string;
	attachmentIds?: string[]
}

export interface IApp {
	id: string;
	createdAt: string;
	name: string;
	creatorId: string;
	description: string;
	scopes: string[];
}

export interface IAppSecret {
	appId: string;
	appSecret: string;
}

export interface IToken {
	appId: string;
	userId: string;
	scopes: string[];
	accessToken: string;
}

export interface ICredentialValidation {
	isValid: boolean;
	userId?: string;
}
