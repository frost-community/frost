import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { ObjectIdValidator } from '../../modules/cafyValidators';
import { PostingResponseObject } from '../../modules/ApiResponse/ResponseObject';

export default define({
	params: {
		text: $.str.range(1, 256).notMatch(/^\s*$/),
		attachmentIds: $.array(ObjectIdValidator).optional,
	},
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {

	// temporary
	const user = await manager.userService.findByScreenName('test');
	if (!user) {
		manager.error(ApiErrorSources.serverError);
		return;
	}

	const {
		text,
		attachmentIds
	} = manager.params;

	const chatPostingDoc = await manager.postingService.createChatPosting(user._id, text, attachmentIds);

	const chatPosting = await chatPostingDoc.pack(manager.db);
	manager.ok(new PostingResponseObject(chatPosting));
});
