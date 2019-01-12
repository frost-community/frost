import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { MongoProvider } from 'frost-component';
import { IUserDocumentSoruce, IUserDocument, UserDocument } from '../modules/documents';

function randomRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildHash(text: string, algorithm?: string) {
	const sha256 = crypto.createHash(algorithm || 'sha256');
	sha256.update(text);

	return sha256.digest('hex');
}

export interface IUserCreateOptions {
	root?: boolean;
}

export default class UserService {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	private db: MongoProvider;

	async create(screenName: string, password: string | null, name: string, description: string, options?: IUserCreateOptions): Promise<UserDocument> {
		options = options || { };

		if (!options.root && password == null) {
			throw new Error('password is empty');
		}

		let passwordHash = null;
		if (password != null) {
			const salt = randomRange(1, 99999);
			const hash = buildHash(`${password}.${salt}`);
			passwordHash = `${hash}.${salt}`;
		}

		const source: IUserDocumentSoruce = {
			screenName,
			passwordHash,
			name,
			description
		};

		if (options.root) {
			source.root = true;
		}

		const rawDocument: IUserDocument = await this.db.create('api.users', source);

		return new UserDocument(rawDocument);
	}

	async findByScreenName(screenName: string): Promise<UserDocument | null> {
		// find (ignore case)
		const rawDocument: IUserDocument | null = await this.db.find('api.users', { screenName: new RegExp(`^${screenName}$`, 'i') });

		return rawDocument ? new UserDocument(rawDocument) : null;
	}

	async findById(userId: string | ObjectId): Promise<UserDocument | null> {
		const rawDocument: IUserDocument | null = await this.db.findById('api.users', userId);

		return rawDocument ? new UserDocument(rawDocument) : null;
	}
}
