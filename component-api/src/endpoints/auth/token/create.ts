import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/endpoint';
import { TokenResponseObject } from '../../../modules/apiResponse/responseObjects';
import { IAppDocument, IUserDocument, AppDocument, TokenDocument } from '../../../modules/documents';
import { ObjectIdContext } from '../../../modules/cafyValidators';

export default define({
	params: {
		appId: $.type(ObjectIdContext),
		userId: $.type(ObjectIdContext),
		scopes: $.array($.str).unique()
	},
	scopes: [AuthScopes.authHost]
}, async (manager) => {

	// params
	const appId: string = manager.params.appId;
	const userId: string = manager.params.userId;
	const scopes: string[] = manager.params.scopes;

	const appDocRaw: IAppDocument = await manager.db.findById('api.apps', appId);
	if (!appDocRaw) {
		manager.error(ApiErrorSources.appNotFound);
		return;
	}
	const appDoc = new AppDocument(appDocRaw);

	const userDocRaw: IUserDocument = await manager.db.findById('api.users', userId);
	if (!userDocRaw) {
		manager.error(ApiErrorSources.userNotFound);
		return;
	}

	const validScopes = (scopes as string[]).every(s => appDoc.hasScope(s));
	if (!validScopes) {
		manager.error(ApiErrorSources.invalidSomeScopes);
		return;
	}

	// NOTE: 同じアプリ、ユーザー、スコープの組み合わせのトークンは生成を拒否
	if ((await manager.tokenService.find(appId, userId, scopes)) != null) {
		manager.error(ApiErrorSources.tokenAlreadyExists);
		return;
	}

	let tokenDoc: TokenDocument;
	try {
		tokenDoc = await manager.tokenService.create(appDocRaw, userDocRaw, scopes);
	}
	catch (err) {
		console.error(err);
		manager.error(ApiErrorSources.serverError, { message: 'failed to create an token' });
		return;
	}

	const token = await tokenDoc.pack(manager.db);

	manager.ok(new TokenResponseObject(token));
});
