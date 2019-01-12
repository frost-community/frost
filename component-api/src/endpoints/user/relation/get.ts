import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/Endpoint';
import { ObjectIdValidator } from '../../../modules/cafyValidators';
import { UserResponseObject, UserRelationResponseObject } from '../../../modules/ApiResponse/ResponseObject';

export default define({
	params: {
		sourceUserId: ObjectIdValidator,
		targetUserId: ObjectIdValidator
	},
	scopes: [AuthScopes.userRead]
}, async (manager) => {
	const {
		targetUserId,
		sourceUserId
	} = manager.params;

	// fetch source user
	const sourceUser = await manager.userService.findById(sourceUserId);
	if (!sourceUser) {
		manager.error(ApiErrorSources.userNotFound, { paramName: 'sourceUserId' });
		return;
	}

	// fetch target user
	const targetUser = await manager.userService.findById(targetUserId);
	if (!targetUser) {
		manager.error(ApiErrorSources.userNotFound, { paramName: 'targetUserId' });
		return;
	}

	if (sourceUser._id.equals(targetUser._id)) {
		manager.error(ApiErrorSources.cannotSpecifySameUser);
		return;
	}

	const relation = await manager.userRelationService.getRelation(sourceUser._id, targetUser._id);

	manager.ok(new UserRelationResponseObject(relation));
});
