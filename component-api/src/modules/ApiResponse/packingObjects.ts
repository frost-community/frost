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

export interface IUserRelation {
	sourceUserId: string;
	targetUserId: string;
	status: 'following' | 'notFollowing';
	message?: string;
}
