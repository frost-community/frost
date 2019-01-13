import $ from 'cafy';
import { MongoProvider } from 'frost-component';
import { define, AuthScopes, ApiErrorSources } from '../../../../modules/endpoint';
import { ObjectIdValidator } from '../../../../modules/cafyValidators';
import timeline from '../../../../modules/timeline';
import { PostingsResponseObject } from '../../../../modules/apiResponse/responseObjects';

export default define({
	params: {
		userId: ObjectIdValidator
	},
	scopes: [AuthScopes.postingRead]
}, async (manager) => {

	const {
		userId
	} = manager.params;

	const chatPostings = await timeline(manager, [MongoProvider.buildId(userId)]);

	manager.ok(new PostingsResponseObject(chatPostings));
});
