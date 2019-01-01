import { ObjectId } from 'mongodb';

// general

export interface IDocument {
	_id: ObjectId | undefined;
}

// posting

export interface IPostingDocument extends IDocument {
	type: string;
	userId: ObjectId;
}

export class PostingDocumentBase implements IPostingDocument {
	constructor(type: string, userId: ObjectId) {
		this.type = type;
		this.userId = userId;
	}
	_id: ObjectId | undefined;
	type: string;
	userId: ObjectId;
}

export class ChatPostingDocument extends PostingDocumentBase {
	constructor(userId: ObjectId, text: string, attachmentIds?: ObjectId[]) {
		super('chat', userId);
		this.text = text;
		this.attachmentIds = attachmentIds;
	}
	text: string;
	attachmentIds?: ObjectId[]
}

// app

export interface IAppDocument extends IDocument {
	name: string;
	description: string;
	scopes: string[];
}

export class AppDocument implements IAppDocument {
	constructor(name: string, description: string, scopes: string[]) {
		this.name = name;
		this.description = description;
		this.scopes = scopes;
	}
	_id: ObjectId | undefined;
	name: string;
	description: string;
	scopes: string[];
}

// user

export interface IUserDocument extends IDocument {
	screenName: string;
	passwordHash: string | null;
	name: string;
	description: string;
	root?: boolean;
}

export class UserDocument implements IUserDocument {
	constructor(screenName: string, passwordHash: string | null, name: string, description: string, root?: boolean) {
		this.screenName = screenName;
		this.passwordHash = passwordHash;
		this.name = name;
		this.description = description;
		this.root = root;
	}
	_id: ObjectId | undefined;
	screenName: string;
	passwordHash: string | null;
	name: string;
	description: string;
	root?: boolean;
}
