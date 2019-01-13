import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { } from '../../modules/apiResponse/responseObjects';

export default define({
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {
	manager.ok('create article posting');
});
