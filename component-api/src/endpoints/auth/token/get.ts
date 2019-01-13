import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/endpoint';
import { TokenResponseObject } from '../../../modules/apiResponse/responseObjects';
import { TokenDocument } from '../../../modules/documents';
import { NullableObjectIdValidator } from '../../../modules/cafyValidators';

export default define({
	params: {
		appId: NullableObjectIdValidator,
		userId: NullableObjectIdValidator,
		scopes: $.array($.str).optional.unique(),
		accessToken: $.str.optional // TODO
	},
	scopes: [AuthScopes.authHost]
}, async (manager) => {

	const {
		appId,
		userId,
		scopes,
		accessToken
	} = manager.params;

	let tokenDoc: TokenDocument | null;
	if (accessToken != null) {
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

		const appDocRaw = await manager.db.findById('api.apps', appId);
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

	const token = await tokenDoc.pack(manager.db);

	manager.ok(new TokenResponseObject(token));
});
