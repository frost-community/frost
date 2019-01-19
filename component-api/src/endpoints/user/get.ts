import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { UserDocument } from '../../modules/documents';
import { NullableObjectIdValidator } from '../../modules/cafyValidators';
import { UserResponseObject } from '../../modules/apiResponse/responseObjects';

export default define({
	params: {
		userId: NullableObjectIdValidator,
		screenName: $.str.optional.range(4, 15).match(/^[a-zA-Z0-9_-]+$/)
	},
	scopes: [AuthScopes.userRead]
}, async (manager) => {
	const {
		userId,
		screenName
	} = manager.params;

	if (!userId && !screenName) {
		manager.error(ApiErrorSources.invalidSearchCondition);
		return;
	}

	let userDoc: UserDocument | null;

	if (screenName) {
		userDoc = await manager.userService.findByScreenName(screenName);
	}
	else {
		userDoc = await manager.userService.findById(userId);
	}

	if (!userDoc) {
		manager.error(ApiErrorSources.userNotFound);
		return;
	}

	const user = await userDoc.pack(manager.db);
	manager.ok(new UserResponseObject(user));
});
