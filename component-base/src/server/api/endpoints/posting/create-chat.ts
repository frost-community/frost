import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../endpoints';
import { ObjectIdContext } from '../../misc/cafyValidators';
import { PostingResponseObject } from '../../response/responseObjects';
import { ChatPostingDocument } from '../../../misc/documents';

export default define({
	params: {
		text: $.str.range(1, 256).notMatch(/^\s*$/),
		attachmentIds: $.array($.type(ObjectIdContext)).optional,
	},
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {

	const account = manager.authInfo!.user;

	// params
	const text: string = manager.params.text;
	const attachmentIds: string[] | undefined = manager.params.attachmentIds;

	let chatPostingDoc: ChatPostingDocument;
	try {
		chatPostingDoc = await manager.postingService.createChatPosting(account._id, text, attachmentIds);
	}
	catch (err) {
		console.error(err);
		manager.error(ApiErrorSources.serverError, { message: 'failed to create an chat posting' });
		return;
	}

	await chatPostingDoc.populate(manager.db);
	const chatPosting = await chatPostingDoc.pack(manager.db);

	manager.success(new PostingResponseObject(chatPosting));
});
