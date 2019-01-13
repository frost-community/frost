import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../../modules/endpoint';
import timeline from '../../../../modules/timeline';
import { PostingsResponseObject } from '../../../../modules/apiResponse/responseObjects';

export default define({
	params: {
		//userId: ObjectIdValidator
	},
	scopes: [AuthScopes.postingRead]
}, async (manager) => {

	const {
	} = manager.params;

	// temporary
	const user = await manager.userService.findByScreenName('test');
	if (!user) {
		manager.error(ApiErrorSources.serverError);
		return;
	}

	// fetch followings
	const followings = await manager.userRelationService.getfollowings(user._id);
	const followingIds = followings.map(f => f._id);
	followingIds.push(user._id);

	const chatPostings = await timeline(manager, followingIds);

	manager.ok(new PostingsResponseObject(chatPostings));
});
