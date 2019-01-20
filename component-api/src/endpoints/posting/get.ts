import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { ObjectIdValidator } from '../../modules/cafyValidators';
import { PostingResponseObject } from '../../modules/apiResponse/responseObjects';

export default define({
	params: {
		postingId: ObjectIdValidator
	},
	scopes: [AuthScopes.postingRead]
}, async (manager) => {

	const {
		postingId
	} = manager.params;

	const chatPostingDoc = await manager.postingService.findByChatId(postingId);
	if (!chatPostingDoc) {
		manager.error(ApiErrorSources.postingNotFound);
		return;
	}

	const chatPosting = await chatPostingDoc.pack(manager.db);

	manager.ok(new PostingResponseObject(chatPosting));
});