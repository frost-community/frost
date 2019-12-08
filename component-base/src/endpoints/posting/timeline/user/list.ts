import $ from 'cafy';
import { MongoProvider } from 'frost-core';
import { define, AuthScopes, ApiErrorSources } from '../../../../modules/endpoint';
import { ObjectIdContext } from '../../../../modules/cafyValidators';
import timeline from '../../../../modules/timeline';
import { PostingsResponseObject } from '../../../../modules/apiResponse/responseObjects';

export default define({
	params: {
		userId: $.type(ObjectIdContext)
	},
	scopes: [AuthScopes.postingRead]
}, async (manager) => {

	// params
	const userId: string = manager.params.userId;

	const chatPostings = await timeline(manager, [MongoProvider.buildId(userId)]);

	manager.success(new PostingsResponseObject(chatPostings));
});
