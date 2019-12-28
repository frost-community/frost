import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../endpoints';
import { TokenResponseObject } from '../../../response/responseObjects';
import { TokenDocument } from '../../../../misc/documents';
import { ObjectIdContext } from '../../../misc/cafyValidators';

export default define({
	params: {
		appId: $.type(ObjectIdContext).optional,
		userId: $.type(ObjectIdContext).optional,
		scopes: $.array($.str).optional.unique(),
		accessToken: $.str.optional // TODO
	},
	scopes: [AuthScopes.authHost]
}, async (manager) => {

	// params
	const appId: string | undefined = manager.params.appId;
	const userId: string | undefined = manager.params.userId;
	const scopes: string[] | undefined = manager.params.scopes;
	const accessToken: string | undefined = manager.params.accessToken;

	let tokenDoc: TokenDocument | null;
	if (accessToken) {
		tokenDoc = await manager.tokenService.findByAccessToken(accessToken);
	}
	else {
		if (!appId) {
			manager.error(ApiErrorSources.missingParam, { paramName: 'appId' });
			return;
		}

		if (!userId) {
			manager.error(ApiErrorSources.missingParam, { paramName: 'userId' });
			return;
		}

		if (!scopes) {
			manager.error(ApiErrorSources.missingParam, { paramName: 'scopes' });
			return;
		}

		const appDocRaw = await manager.db.findById('base.apps', appId);
		if (!appDocRaw) {
			manager.error(ApiErrorSources.appNotFound);
			return;
		}

		const userDoc = await manager.userService.findById(userId);
		if (!userDoc) {
			manager.error(ApiErrorSources.userNotFound);
			return;
		}

		tokenDoc = await manager.tokenService.find(appId, userId, scopes);
	}

	if (!tokenDoc) {
		manager.error(ApiErrorSources.tokenNotFound);
		return;
	}

	await tokenDoc.populate(manager.db);
	const token = await tokenDoc.pack(manager.db);

	manager.success(new TokenResponseObject(token));
});
