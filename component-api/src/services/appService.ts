import { MongoProvider } from 'frost-component';
import { ObjectId } from 'mongodb';
import { AppDocument, IAppDocument, ChatPostingDocument, IAppDocumentSoruce, IChatPostingDocument, UserDocument } from "../modules/documents";
import buildHash from '../modules/buildHash';
import IApiConfig from '../modules/IApiConfig';

export default class AppService {
	constructor(db: MongoProvider, config: IApiConfig) {
		this.db = db;
		this.config = config;
	}

	private db: MongoProvider;
	private config: IApiConfig;

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
