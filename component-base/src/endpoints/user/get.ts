import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { UserDocument } from '../../modules/documents';
import { ObjectIdContext } from '../../modules/cafyValidators';
import { UserResponseObject } from '../../modules/apiResponse/responseObjects';

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
