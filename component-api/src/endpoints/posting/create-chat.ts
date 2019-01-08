import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { PostingResponseObject } from '../../modules/ApiResponse/ResponseObject';
import UserService from '../../services/UserService';
import PostingService from '../../services/PostingService';

export default define({
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {
	const userService = new UserService(manager.db);
	const postingService = new PostingService(manager.db);

	const user = await userService.create('froster1', 'abc', 'froster', 'hi');
	const chatPostingDoc = await postingService.createChatPosting(user._id, 'hello');

	const chatPosting = await chatPostingDoc.pack(manager.db);
	manager.ok(new PostingResponseObject(chatPosting));
});
