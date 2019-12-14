import { define, AuthScopes, ApiErrorSources } from 'local/src/api/routing/endpoint';
import { } from 'local/src/api/response/responseObjects';

export default define({
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {
	manager.success('create reference posting');
});
