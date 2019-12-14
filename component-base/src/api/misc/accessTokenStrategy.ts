import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { MongoProvider } from 'frost-core';
import {
	IAppDocument, AppDocument, IUserDocument, UserDocument, ITokenDocument, TokenDocument
} from '../documents';

export default (db: MongoProvider) => {
	passport.use('accessToken', new BearerStrategy(async (accessToken, done) => {
		try {
			const tokenDocRaw: ITokenDocument = await db.find('base.tokens', { accessToken });
			if (!tokenDocRaw) {
				done(null, false);
				return;
			}
			const tokenDoc = new TokenDocument(tokenDocRaw);

			const userDocRaw: IUserDocument = await db.find('base.users', { _id: tokenDocRaw.userId });
			if (!userDocRaw) {
				done(null, false);
				return;
			}
			const userDoc = new UserDocument(userDocRaw);

			const appDocRaw: IAppDocument = await db.find('base.apps', { _id: tokenDocRaw.appId });
			if (!appDocRaw) {
				done(null, false);
				return;
			}
			const appDoc = new AppDocument(appDocRaw);
			await appDoc.populate(db);
			done(null, userDoc, { app: appDoc, token: tokenDoc } as any);
		}
		catch (err) {
			done(err);
		}
	}));
};
