import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { MessageObject } from '../../modules/ApiResponse/ResponseObject';

export default define({
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {
	manager.ok(new MessageObject('create article posting'));
});
