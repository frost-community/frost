import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/endpoint';
import { ObjectIdContext } from '../../../modules/cafyValidators';
import { UsersResponseObject } from '../../../modules/apiResponse/responseObjects';

export default define({
	params: {
		userId: $.type(ObjectIdContext)
	},
	scopes: [AuthScopes.userRead]
}, async (manager) => {

	// params
	const userId: string = manager.params.userId;

	// fetch user
	const user = await manager.userService.findById(userId);
	if (!user) {
		manager.error(ApiErrorSources.userNotFound, { paramName: 'userId' });
		return;
	}

	const followingDocs = await manager.userRelationService.getfollowings(user._id);

	const followings = await manager.packAll(followingDocs);

	manager.ok(new UsersResponseObject(followings));
});
