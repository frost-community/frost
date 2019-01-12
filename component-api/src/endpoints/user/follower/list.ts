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

	const followerUserDocs = await manager.userRelationService.getfollowers(user._id);

	const followerUserPromises = followerUserDocs.map(followerUserDoc => {
		return followerUserDoc.pack(manager.db);
	});

	const followerUsers = await Promise.all(followerUserPromises);

	manager.ok(new UsersResponseObject(followerUsers));
});
