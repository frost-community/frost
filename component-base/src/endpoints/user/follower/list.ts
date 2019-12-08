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

	const followerDocs = await manager.userRelationService.getfollowers(user._id);

	const followers = await manager.packAll(followerDocs);

	manager.success(new UsersResponseObject(followers));
});
