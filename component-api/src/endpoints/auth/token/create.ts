import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/Endpoint';
import { TokenResponseObject } from '../../../modules/ApiResponse/ResponseObject';
import { IAppDocument, IUserDocument, AppDocument, TokenDocument } from '../../../modules/documents';
import { ObjectIdValidator } from '../../../modules/cafyValidators';

export default define({
	params: {
		appId: ObjectIdValidator,
		userId: ObjectIdValidator,
		scopes: $.array($.str).unique()
	},
	scopes: [AuthScopes.authHost]
}, async (manager) => {

	const {
		appId,
		userId,
		scopes
	} = manager.params;

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
