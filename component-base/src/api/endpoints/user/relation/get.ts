import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../endpoints';
import { UserRelationResponseObject } from '../../../response/responseObjects';
import { ObjectIdContext } from '../../../../misc/cafyValidators';

export default define({
	params: {
		sourceUserId: $.type(ObjectIdContext),
		targetUserId: $.type(ObjectIdContext)
	},
	scopes: [AuthScopes.userRead]
}, async (manager) => {

	// params
	const targetUserId: string = manager.params.targetUserId;
	const sourceUserId: string = manager.params.sourceUserId;

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

	manager.success(new UserRelationResponseObject(relation));
});
