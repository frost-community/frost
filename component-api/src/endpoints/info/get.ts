import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { MessageObject } from '../../modules/ApiResponse/ResponseObject';

export default define({ }, async (manager) => {
	manager.ok(new MessageObject('info'));
});
