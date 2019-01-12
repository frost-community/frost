import { MongoProvider } from 'frost-component';
import { ObjectId } from 'mongodb';
import { ChatPostingDocument, IChatPostingDocumentSoruce, IChatPostingDocument } from "../modules/documents";

export default class PostingService {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	private db: MongoProvider;

	async createChatPosting(userId: ObjectId, text: string, attachmentIds?: ObjectId[]): Promise<ChatPostingDocument> {
		const source: IChatPostingDocumentSoruce = {
			userId,
			text
		};

		if (attachmentIds) {
			source.attachmentIds = attachmentIds;
		}

		const documentRaw: IChatPostingDocument = await this.db.create('api.postings', source);

		return new ChatPostingDocument(documentRaw);
	}
}
