import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from 'local/src/api/routing/endpoint';
import { UserDocument } from 'local/src/api/documents';
import { UserResponseObject } from 'local/src/api/response/responseObjects';
import { ObjectIdContext } from 'local/src/misc/cafyValidators';

export default define({
	params: {
		userId: $.type(ObjectIdContext).optional,
		screenName: $.str.optional.range(4, 15).match(/^[a-zA-Z0-9_-]+$/)
	},
	scopes: [AuthScopes.userRead]
}, async (manager) => {

	// params
	const userId: string | undefined = manager.params.userId;
	const screenName: string | undefined = manager.params.screenName;

	if (!userId && !screenName) {
		manager.error(ApiErrorSources.invalidSearchCondition);
		return;
	}

	let userDoc: UserDocument | null;

	if (screenName) {
		userDoc = await manager.userService.findByScreenName(screenName);
	}
	else {
		userDoc = await manager.userService.findById(userId!);
	}

	if (!userDoc) {
		manager.error(ApiErrorSources.userNotFound);
		return;
	}

	const user = await userDoc.pack(manager.db);
	manager.success(new UserResponseObject(user));
});
