import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { ObjectIdValidator } from '../../modules/cafyValidators';
import { UserResponseObject, UserRelationResponseObject } from '../../modules/ApiResponse/ResponseObject';

export default define({
	params: {
		targetUserId: ObjectIdValidator,
		message: $.str.optional.range(1, 64)
	},
	scopes: [AuthScopes.userWrite]
}, async (manager) => {
	const {
		targetUserId,
		message
	} = manager.params;

	// temporary
	const account = await manager.userService.findByScreenName('test');
	if (!account) {
		manager.error(ApiErrorSources.serverError);
		return;
	}

	// fetch target user
	const targetUser = await manager.userService.findById(targetUserId);
	if (!targetUser) {
		manager.error(ApiErrorSources.userNotFound, { paramName: 'targetUserId' });
		return;
	}

	if (targetUser._id.equals(account._id)) {
		manager.error(ApiErrorSources.cannotSpecifyMyself, { paramName: 'targetUserId' });
		return;
	}

	const userRelationDoc = await manager.userRelationService.follow(account._id, targetUser._id, message);

	const userRelation = await userRelationDoc.pack(manager.db);

	manager.ok(new UserRelationResponseObject(userRelation));
});
