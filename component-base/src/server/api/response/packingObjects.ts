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
	sourceUser?: IUser;
	targetUserId: string;
	targetUser?: IUser;
	status: 'following' | 'notFollowing';
	message?: string;
}

export interface IPosting {
	id: string;
	createdAt: string;
	type: string;
	userId: string;
	user?: IUser;
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
	creator?: IUser;
	description: string;
	scopes: string[];
}

export interface IAppSecret {
	appId: string;
	app?: IApp;
	appSecret: string;
}

export interface IToken {
	appId: string;
	app?: IApp;
	userId: string;
	user?: IUser;
	scopes: string[];
	accessToken: string;
}

export interface IValidationResultValid {
	isValid: true;
	userId: string;
	user?: IUser;
}

export interface IValidationResultInvalid {
	isValid: false;
}
