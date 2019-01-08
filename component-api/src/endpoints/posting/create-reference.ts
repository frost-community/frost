import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { } from '../../modules/ApiResponse/ResponseObject';

export default define({
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {
	manager.ok('create reference posting');
});
