import { MongoProvider } from 'frost-component';
import { ObjectId } from 'mongodb';
import { IUserRelationDocument, UserRelationDocument, IUserDocumentSoruce } from "../modules/documents";
import { IUserRelation } from '../modules/ApiResponse/packingObjects';

export default class UserRelationService {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	private db: MongoProvider;

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
		let documentRaw: IUserRelationDocument = await this.db.find('api.userRelations', {
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
}
