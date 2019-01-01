import { MongoProvider } from 'frost-component';
import { ObjectId } from 'mongodb';
import { ChatPostingDocument } from "../modules/documents";

export default class PostingService {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	db: MongoProvider;

	async createChatPosting(userId: ObjectId, text: string, attachmentIds?: ObjectId[]): Promise<ChatPostingDocument> {
		const postingDoc = new ChatPostingDocument(userId, text, attachmentIds);
		const result: ChatPostingDocument = await this.db.create('api.postings', postingDoc);

		return result;
	}
}
