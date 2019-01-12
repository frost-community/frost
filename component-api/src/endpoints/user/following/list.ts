import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/Endpoint';
import { ObjectIdValidator } from '../../../modules/cafyValidators';
import { UsersResponseObject } from '../../../modules/ApiResponse/ResponseObject';

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

	const followingUserDocs = await manager.userRelationService.getfollowings(user._id);

	const followingUserPromises = followingUserDocs.map(followingUserDoc => {
		return followingUserDoc.pack(manager.db);
	});

	const followingUsers = await Promise.all(followingUserPromises);

	manager.ok(new UsersResponseObject(followingUsers));
});
