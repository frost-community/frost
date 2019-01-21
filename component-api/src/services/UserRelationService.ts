import { MongoProvider } from 'frost-component';
import { ObjectId } from 'mongodb';
import { IUserRelationDocument, UserRelationDocument, UserDocument } from "../modules/documents";
import { IUserRelation } from '../modules/apiResponse/packingObjects';
import { EndpointManager } from '../modules/endpoint';

export default class UserRelationService {
	constructor(db: MongoProvider, manager: EndpointManager) {
		this.db = db;
		this.manager = manager;
	}

	private db: MongoProvider;
	private manager: EndpointManager;

	async follow(sourceUserId: string | ObjectId, targetUserId: string | ObjectId, message?: string) {
		let documentRaw: IUserRelationDocument;
		documentRaw = await this.db.upsert(
			'api.userRelations',
			{ sourceUserId: MongoProvider.buildId(sourceUserId), targetUserId: MongoProvider.buildId(targetUserId) },
			{ sourceUserId: MongoProvider.buildId(sourceUserId), targetUserId: MongoProvider.buildId(targetUserId), message, status: 'following' });

		return new UserRelationDocument(documentRaw);
	}

	async unfollow(sourceUserId: string | ObjectId, targetUserId: string | ObjectId) {
		let documentRaw: IUserRelationDocument;
		documentRaw = await this.db.upsert(
			'api.userRelations',
			{ sourceUserId: MongoProvider.buildId(sourceUserId), targetUserId: MongoProvider.buildId(targetUserId) },
			{ sourceUserId: MongoProvider.buildId(sourceUserId), targetUserId: MongoProvider.buildId(targetUserId), message: null, status: 'notFollowing' });

		return new UserRelationDocument(documentRaw);
	}

	async getRelation(sourceUserId: string | ObjectId, targetUserId: string | ObjectId): Promise<IUserRelation> {
		const documentRaw: IUserRelationDocument = await this.db.find('api.userRelations', {
			sourceUserId: sourceUserId,
			targetUserId: targetUserId
		});

		if (!documentRaw) {
			return {
				sourceUserId: MongoProvider.buildId(sourceUserId).toHexString(),
				targetUserId: MongoProvider.buildId(targetUserId).toHexString(),
				status: 'notFollowing'
			};
		}

		const doc = new UserRelationDocument(documentRaw);
		const userRelation = await doc.pack(this.db);

		return userRelation;
	}

	async getfollowings(userId: string | ObjectId): Promise<UserDocument[]> {
		const documentRaws: IUserRelationDocument[] = await this.db.findArray('api.userRelations', {
			sourceUserId: MongoProvider.buildId(userId),
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

	async getfollowers(userId: string | ObjectId): Promise<UserDocument[]> {
		const documentRaws: IUserRelationDocument[] = await this.db.findArray('api.userRelations', {
			targetUserId: MongoProvider.buildId(userId),
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
