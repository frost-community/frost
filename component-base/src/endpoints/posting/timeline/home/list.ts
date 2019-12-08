import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../../modules/endpoint';
import timeline from '../../../../modules/timeline';
import { PostingsResponseObject } from '../../../../modules/apiResponse/responseObjects';

export default define({
	params: {
		//userId: $.type(ObjectIdContext)
	},
	scopes: [AuthScopes.postingRead]
}, async (manager) => {

	const account = manager.authInfo!.user;

	// params
	//const userId: string = manager.params.userId;

	// fetch followings
	const followings = await manager.userRelationService.getfollowings(account._id);
	const followingIds = followings.map(f => f._id);
	followingIds.push(account._id);

	const chatPostings = await timeline(manager, followingIds);

	manager.success(new PostingsResponseObject(chatPostings));
});
