import { MongoProvider } from 'frost-component';
import { ObjectId } from 'mongodb';
import { IUserRelationDocument, UserRelationDocument, IUserDocumentSoruce, UserDocument } from "../modules/documents";
import { IUserRelation } from '../modules/ApiResponse/packingObjects';
import { EndpointManager, ApiErrorSources } from '../modules/Endpoint';

export default class UserRelationService {
	constructor(db: MongoProvider, manager: EndpointManager) {
		this.db = db;
		this.manager = manager;
	}

	private db: MongoProvider;
	private manager: EndpointManager;

	async follow(sourceUserId: ObjectId, targetUserId: ObjectId, message?: string) {
		let documentRaw: IUserRelationDocument;
		documentRaw = await this.db.upsert(
			'api.userRelations',
			{ sourceUserId: sourceUserId, targetUserId: targetUserId },
			{ sourceUserId: sourceUserId, targetUserId: targetUserId, message, status: 'following' });

		return new UserRelationDocument(documentRaw);
	}

	async unfollow(sourceUserId: ObjectId, targetUserId: ObjectId) {
		let documentRaw: IUserRelationDocument;
		documentRaw = await this.db.upsert(
			'api.userRelations',
			{ sourceUserId: sourceUserId, targetUserId: targetUserId },
			{ sourceUserId: sourceUserId, targetUserId: targetUserId, message: null, status: 'notFollowing' });

		return new UserRelationDocument(documentRaw);
	}

	async getRelation(sourceUserId: ObjectId, targetUserId: ObjectId): Promise<IUserRelation> {
		const documentRaw: IUserRelationDocument = await this.db.find('api.userRelations', {
			sourceUserId: sourceUserId,
			targetUserId: targetUserId
		});

		if (!documentRaw) {
			return {
				sourceUserId: sourceUserId.toHexString(),
				targetUserId: targetUserId.toHexString(),
				status: 'notFollowing'
			};
		}

		const doc = new UserRelationDocument(documentRaw);
		const userRelation = await doc.pack(this.db);

		return userRelation;
	}

	async getfollowings(userId: ObjectId): Promise<UserDocument[]> {
		const documentRaws: IUserRelationDocument[] = await this.db.findArray('api.userRelations', {
			sourceUserId: userId,
			status: 'following'
		});

		const followings = documentRaws.map(docRaw => new UserRelationDocument(docRaw));

		const userPromises = followings.map(async following => {
			const user = await this.manager.userService.findById(following.targetUserId);
			if (!user) {
				console.warn(`not existing user: ${following.targetUserId.toHexString()}`);
			}
			return user;
		});

		const usersWithNull = await Promise.all(userPromises);

		const users: UserDocument[] = [];
		for (const userOrNull of usersWithNull) {
			if (userOrNull) users.push(userOrNull);
		}

		return users;
	}

	async getfollowers(userId: ObjectId): Promise<UserDocument[]> {
		const documentRaws: IUserRelationDocument[] = await this.db.findArray('api.userRelations', {
			targetUserId: userId,
			status: 'following'
		});

		const followers = documentRaws.map(docRaw => new UserRelationDocument(docRaw));

		const userPromises = followers.map(async follower => {
			const user = await this.manager.userService.findById(follower.sourceUserId);
			if (!user) {
				console.warn(`not existing user: ${follower.sourceUserId.toHexString()}`);
			}
			return user;
		});

		const usersWithNull = await Promise.all(userPromises);

		const users: UserDocument[] = [];
		for (const userOrNull of usersWithNull) {
			if (userOrNull) users.push(userOrNull);
		}

		return users;
	}
}
