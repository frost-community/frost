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

	const followerDocs = await manager.userRelationService.getfollowers(user._id);

	const followers = await manager.packAll(followerDocs);

	manager.ok(new UsersResponseObject(followers));
});
