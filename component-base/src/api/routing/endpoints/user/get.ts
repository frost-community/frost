import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../endpoint';
import { UserDocument } from '../../../documents';
import { UserResponseObject } from '../../../response/responseObjects';
import { ObjectIdContext } from '../../../../misc/cafyValidators';

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
