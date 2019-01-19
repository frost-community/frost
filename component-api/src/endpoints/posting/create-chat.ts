import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { ObjectIdValidator } from '../../modules/cafyValidators';
import { PostingResponseObject } from '../../modules/apiResponse/responseObjects';
import { ChatPostingDocument } from '../../modules/documents';

export default define({
	params: {
		text: $.str.range(1, 256).notMatch(/^\s*$/),
		attachmentIds: $.array(ObjectIdValidator).optional,
	},
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {

	const account = manager.authInfo!.user;

	const {
		text,
		attachmentIds
	} = manager.params;

	let chatPostingDoc: ChatPostingDocument;
	try {
		chatPostingDoc = await manager.postingService.createChatPosting(account._id, text, attachmentIds);
	}
	catch (err) {
		console.error(err);
		manager.error(ApiErrorSources.serverError, { message: 'failed to create an chat posting' });
		return;
	}

	const chatPosting = await chatPostingDoc.pack(manager.db);

	manager.ok(new PostingResponseObject(chatPosting));
});
