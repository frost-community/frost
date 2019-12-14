import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from 'local/src/api/routing/endpoint';
import { UsersResponseObject } from 'local/src/api/response/responseObjects';
import { ObjectIdContext } from 'local/src/misc/cafyValidators';

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

	manager.success(new UsersResponseObject(followings));
});
