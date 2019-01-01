export interface IUser {
	id: string;
	passwordHash?: string;
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
	type: string;
	createdAt: string;
	user: IUser;
}

export interface IChatPosting extends IPosting {
	text: string;
	attachmentIds?: string[]
}

export interface IApp {
	name: string;
	creatorId: string;
	description: string;
	scopes: string[];
}

export interface IUserRelation {
	sourceId: string;
	targetId: string;
	following: boolean;
}
