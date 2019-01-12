/*
	define the structure of the data stored in the database
*/

import { ObjectId } from 'mongodb';
import moment from 'moment';
import uid from 'uid2';
import { MongoProvider } from 'frost-component';
import { IChatPosting, IUser, IUserRelation, IApp, IToken } from './ApiResponse/packingObjects';
import IApiConfig from './IApiConfig';
import buildHash from './buildHash';

export interface IDocument<PackingObject> {
	pack(db: MongoProvider): Promise<PackingObject>;
}

// posting

export interface IChatPostingDocumentSoruce {
	type: 'chat';
	userId: ObjectId;
	text: string;
	attachmentIds?: ObjectId[];
}

export interface IChatPostingDocument extends IChatPostingDocumentSoruce {
	_id: ObjectId;
}

export class ChatPostingDocument implements IDocument<IChatPosting> {
	constructor(raw: IChatPostingDocument) {
		this._id = raw._id;
		this.userId = raw.userId;
		this.text = raw.text;
		this.attachmentIds = raw.attachmentIds;
	}
	_id: ObjectId;
	type: string = 'chat';
	userId: ObjectId;
	text: string;
	attachmentIds?: ObjectId[];

	async pack(db: MongoProvider): Promise<IChatPosting> {
		const userSource = await db.findById('api.users', this.userId);
		const userEntity = await new UserDocument(userSource).pack(db);

		let attachmentIds: string[] | undefined;
		if (this.attachmentIds && this.attachmentIds.length > 0) {
			attachmentIds = this.attachmentIds.map(attachmentId => attachmentId.toHexString());
		}

		return {
			id: this._id.toHexString(),
			createdAt: moment(this._id.getTimestamp()).format('X'),
			type: this.type,
			user: userEntity,
			text: this.text,
			attachmentIds: attachmentIds
		};
	}
}

// app

export interface IAppDocumentSoruce {
	name: string;
	creatorId: ObjectId;
	description: string;
	scopes: string[];
	root?: boolean;
	seed?: string;
}

export interface IAppDocument extends IAppDocumentSoruce {
	_id: ObjectId;
}

export class AppDocument implements IAppDocument, IDocument<IApp> {
	constructor(raw: IAppDocument) {
		this._id = raw._id;
		this.name = raw.name;
		this.creatorId = raw.creatorId;
		this.description = raw.description;
		this.scopes = raw.scopes;
		this.root = raw.root;
		this.seed = raw.seed;
	}
	_id: ObjectId;
	name: string;
	creatorId: ObjectId;
	description: string;
	scopes: string[];
	root?: boolean;
	seed?: string;

	async pack(db: MongoProvider): Promise<IApp> {
		return {
			id: this._id.toHexString(),
			createdAt: moment(this._id.getTimestamp()).format('X'),
			name: this.name,
			creatorId: this.creatorId.toHexString(),
			description: this.description,
			scopes: this.scopes
		};
	}

	async generateAppSecret(db: MongoProvider) {
		const seed = uid(8);
		const updatedAppDoc = await db.updateById('api.apps', this._id.toHexString(), { seed });
		const secret = this.getAppSecret(updatedAppDoc);

		return secret;
	}

	getAppSecret(config: IApiConfig) {
		if (this.seed == null) {
			throw new Error('seed is empty');
		}

		const secret = buildHash(`${config.appSecretKey}/${this._id}/${this.seed}`);

		return secret;
	}

	existsAppSecret() {
		return this.seed != null;
	}

	hasScope(scopeId: string): boolean {
		return this.scopes.indexOf(scopeId) != -1;
	}
}

// token

export interface ITokenDocumentSource {
	appId: ObjectId;
	userId: ObjectId;
	scopes: string[];
	accessToken: string;
	host?: boolean;
}

export interface ITokenDocument extends ITokenDocumentSource {
	_id: ObjectId;
}

export class TokenDocument implements ITokenDocument, IDocument<IToken> {
	constructor(raw: ITokenDocument) {
		this._id = raw._id;
		this.appId = raw.appId;
		this.userId = raw.userId;
		this.scopes = raw.scopes;
		this.accessToken = raw.accessToken;
		this.host = raw.host;
	}
	_id: ObjectId;
	appId: ObjectId;
	userId: ObjectId;
	scopes: string[];
	accessToken: string;
	host?: boolean;

	async pack(db: MongoProvider): Promise<IToken> {
		return {
			appId: this.appId.toHexString(),
			userId: this.userId.toHexString(),
			accessToken: this.accessToken
		};
	}
}

// user

export interface IUserDocumentSoruce {
	screenName: string;
	passwordHash: string | null;
	name: string;
	description: string;
	root?: boolean;
}

export interface IUserDocument extends IUserDocumentSoruce {
	_id: ObjectId;
}

export class UserDocument implements IUserDocument, IDocument<IUser> {
	constructor(raw: IUserDocument) {
		this._id = raw._id;
		this.screenName = raw.screenName;
		this.passwordHash = raw.passwordHash;
		this.name = raw.name;
		this.description = raw.description;
		this.root = raw.root;
	}
	_id: ObjectId;
	screenName: string;
	passwordHash: string | null;
	name: string;
	description: string;
	root?: boolean;

	async pack(db: MongoProvider): Promise<IUser> {
		let followingsCount: number;
		let followersCount: number;
		let postingsCount: { chat?: number };

		postingsCount = {};
		[followingsCount, followersCount, postingsCount.chat] = await Promise.all([
			db.count('api.userRelations', { source: this._id }),
			db.count('api.userRelations', { target: this._id }),
			db.count('api.postings', { type: 'chat', userId: this._id })
		]);

		return {
			id: this._id.toHexString(),
			createdAt: moment(this._id.getTimestamp()).format('X'),
			screenName: this.screenName,
			name: this.name,
			description: this.description,
			followingsCount: followingsCount,
			followersCount: followersCount,
			postingsCount: postingsCount
		};
	}

	validatePassword(password: string): boolean {
		if (!this.passwordHash) return false;

		const [hash, salt] = this.passwordHash.split('.');

		return hash == buildHash(`${password}.${salt}`);
	}
}

// userRelation

export interface IUserRelationDocumentSoruce {
	sourceUserId: ObjectId;
	targetUserId: ObjectId;
	status: 'following' | 'notFollowing';
	message?: string;
}

export interface IUserRelationDocument extends IUserRelationDocumentSoruce {
	_id: ObjectId;
}

export class UserRelationDocument implements IUserRelationDocument, IDocument<IUserRelation> {
	constructor(raw: IUserRelationDocument) {
		this._id = raw._id;
		this.sourceUserId = raw.sourceUserId;
		this.targetUserId = raw.targetUserId;
		this.status = raw.status;
		this.message = raw.message;
	}
	_id: ObjectId;
	sourceUserId: ObjectId;
	targetUserId: ObjectId;
	status: 'following' | 'notFollowing';
	message?: string;

	async pack(db: MongoProvider): Promise<IUserRelation> {
		const packed: IUserRelation = {
			sourceUserId: this.sourceUserId.toHexString(),
			targetUserId: this.targetUserId.toHexString(),
			status: this.status
		};

		if (this.message) {
			packed.message = this.message;
		}

		return packed;
	}
}
