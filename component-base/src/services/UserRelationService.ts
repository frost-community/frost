import { MongoProvider } from 'frost-core';
import { ObjectId } from 'mongodb';
import {
	IUserRelationDocument, UserRelationDocument, UserDocument, IUserRelationDocumentSoruce
} from "../modules/documents";
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
		const query = {
			sourceUserId: MongoProvider.buildId(sourceUserId),
			targetUserId: MongoProvider.buildId(targetUserId)
		};
		const docSource: IUserRelationDocumentSoruce = {
			sourceUserId: query.sourceUserId,
			targetUserId: query.targetUserId,
			message: message,
			status: 'following'
		};
		const documentRaw: IUserRelationDocument = await this.db.upsert('base.userRelations', query, docSource);

		return new UserRelationDocument(documentRaw);
	}

	async unfollow(sourceUserId: string | ObjectId, targetUserId: string | ObjectId) {
		const query = {
			sourceUserId: MongoProvider.buildId(sourceUserId),
			targetUserId: MongoProvider.buildId(targetUserId)
		};
		const docSource: IUserRelationDocumentSoruce = {
			sourceUserId: query.sourceUserId,
			targetUserId: query.targetUserId,
			message: undefined,
			status: 'notFollowing'
		};
		const docRaw: IUserRelationDocument = await this.db.upsert('base.userRelations', query, docSource);

		return new UserRelationDocument(docRaw);
	}

	async getRelation(sourceUserId: string | ObjectId, targetUserId: string | ObjectId): Promise<IUserRelation> {
		const docRaw: IUserRelationDocument = await this.db.find('base.userRelations', {
			sourceUserId: sourceUserId,
			targetUserId: targetUserId
		});

		if (!docRaw) {
			return {
				sourceUserId: MongoProvider.buildId(sourceUserId).toHexString(),
				targetUserId: MongoProvider.buildId(targetUserId).toHexString(),
				status: 'notFollowing'
			};
		}

		const userRelationDoc = new UserRelationDocument(docRaw);
		const userRelation = await userRelationDoc.pack(this.db);

		return userRelation;
	}

	async getfollowings(userId: string | ObjectId): Promise<UserDocument[]> {
		const docRaws: IUserRelationDocument[] = await this.db.findArray('base.userRelations', {
			sourceUserId: MongoProvider.buildId(userId),
			status: 'following'
		});

		const followings = docRaws.map(docRaw => new UserRelationDocument(docRaw));

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
		const docRaws: IUserRelationDocument[] = await this.db.findArray('base.userRelations', {
			targetUserId: MongoProvider.buildId(userId),
			status: 'following'
		});

		const followers = docRaws.map(docRaw => new UserRelationDocument(docRaw));

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
