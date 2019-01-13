import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { MongoProvider } from 'frost-component';
import { IAppDocument, AppDocument, IUserDocument, UserDocument, ITokenDocument } from './documents';

export default (db: MongoProvider) => {
	passport.use('accessToken', new BearerStrategy(async (accessToken, done) => {
		try {
			const tokenDocRaw: ITokenDocument = await db.find('api.tokens', { accessToken });
			if (!tokenDocRaw) {
				done(null, false);
				return;
			}

			const userDocRaw: IUserDocument = await db.find('api.users', { _id: tokenDocRaw.userId });
			if (!userDocRaw) {
				done(null, false);
				return;
			}
			const userDoc = new UserDocument(userDocRaw);

			const appDocRaw: IAppDocument = await db.find('api.apps', { _id: tokenDocRaw.appId });
			if (!appDocRaw) {
				done(null, false);
				return;
			}
			const appDoc = new AppDocument(appDocRaw);
			done(null, userDoc, { app: appDoc, scopes: tokenDocRaw.scopes } as any);
		}
		catch (err) {
			done(err);
		}
	}));
};
