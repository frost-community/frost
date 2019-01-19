import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/endpoint';
import { ObjectIdValidator } from '../../../modules/cafyValidators';
import { UsersResponseObject } from '../../../modules/apiResponse/responseObjects';

export default define({
	params: {
		userId: ObjectIdValidator
	},
	scopes: [AuthScopes.userRead]
}, async (manager) => {
	const {
		userId
	} = manager.params;

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
