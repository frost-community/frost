import { MongoProvider } from 'frost-component';
import { ObjectId } from 'mongodb';
import { ChatPostingDocument, IChatPostingDocumentSoruce, IChatPostingDocument } from "../modules/documents";

export default class PostingService {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	private db: MongoProvider;

	async createChatPosting(userId: string | ObjectId, text: string, attachmentIds?: (ObjectId | string)[]): Promise<ChatPostingDocument> {
		const source: IChatPostingDocumentSoruce = {
			type: 'chat',
			userId: MongoProvider.buildId(userId),
			text
		};

		if (attachmentIds) {
			source.attachmentIds = attachmentIds.map(i => MongoProvider.buildId(i));
		}

		const documentRaw: IChatPostingDocument = await this.db.create('api.postings', source);

		return new ChatPostingDocument(documentRaw);
	}

	async findByChatId(chatPostingId: string | ObjectId): Promise<ChatPostingDocument | null> {
		const rawDocument: any = await this.db.findById('api.postings', chatPostingId);
		if (rawDocument && rawDocument.type != 'chat') {
			return null;
		}

		return rawDocument ? new ChatPostingDocument(rawDocument) : null;
	}
}
