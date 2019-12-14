import $ from 'cafy';
import { MongoProvider } from 'frost-core';
import { define, AuthScopes, ApiErrorSources } from 'local/src/api/routing/endpoint';
import { ObjectIdContext } from 'local/src/misc/cafyValidators';
import timeline from 'local/src/api/misc/timeline';
import { PostingsResponseObject } from 'local/src/api/response/responseObjects';

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
