import { define, AuthScopes, ApiErrorSources } from '../../endpoints';
import { } from '../../response/responseObjects';

export default define({
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {
	manager.success('create article posting');
});
