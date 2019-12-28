import { MongoProvider } from 'frost-core';
import { ObjectId } from 'mongodb';
import randomstring from 'randomstring';
import { IAppDocument, IUserDocument, ITokenDocumentSource, ITokenDocument, TokenDocument } from '../misc/documents';

export default class TokenService {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	private db: MongoProvider;

	async create(app: IAppDocument, user: IUserDocument, scopes: string[], host?: boolean): Promise<TokenDocument> {
		const data: ITokenDocumentSource = {
			appId: app._id,
			userId: user._id,
			scopes: scopes,
			accessToken: randomstring.generate({ length: 128 })
		};

		if (host) {
			data.host = true;
		}

		const tokenDocRaw: ITokenDocument = await this.db.create('base.tokens', data);

		return new TokenDocument(tokenDocRaw);
	}

	async find(appId: string | ObjectId, userId: string | ObjectId, scopes: string[]): Promise<TokenDocument | null> {
		const scopesQuery: any = { $size: scopes.length };
		// NOTE: 空の配列を$allに指定すると検索にヒットしなくなるので、空のときは$allを指定しない
		if (scopes.length != 0) {
			scopesQuery.$all = scopes;
		}

		const tokenDocRaw = await this.db.find('base.tokens', {
			appId: MongoProvider.buildId(appId),
			userId: MongoProvider.buildId(userId),
			scopes: scopesQuery
		});

		return tokenDocRaw ? new TokenDocument(tokenDocRaw) : null;
	}

	async findByAccessToken(accessToken: string): Promise<TokenDocument | null> {
		const tokenDocRaw = await this.db.find('base.tokens', { accessToken });

		return tokenDocRaw ? new TokenDocument(tokenDocRaw) : null;
	}
}
