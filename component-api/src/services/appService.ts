import { MongoProvider } from 'frost-component';
import { ObjectId } from 'mongodb';
import { AppDocument, IAppDocument, ChatPostingDocument, IAppDocumentSoruce, IChatPostingDocument, UserDocument } from "../modules/documents";

export default class AppService {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	private db: MongoProvider;

	async create(name: string, user: UserDocument, description: string, scopes: string[]): Promise<AppDocument> {
		const source: IAppDocumentSoruce = {
			creatorId: user._id,
			description: description,
			name: name,
			scopes: scopes
		};

		const appDocRaw: IAppDocument = await this.db.create('api.apps', source);

		return new AppDocument(appDocRaw);
	}

	async findArrayByCreatorId(creatorId: string | ObjectId): Promise<AppDocument[]> {
		const rawAppDocs: IAppDocument[] = await this.db.findArray('api.apps', {
			creatorId: MongoProvider.buildId(creatorId)
		});

		return rawAppDocs.map(rawAppDoc => new AppDocument(rawAppDoc));
	}
}
