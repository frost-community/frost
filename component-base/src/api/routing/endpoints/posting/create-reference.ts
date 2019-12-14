import { define, AuthScopes, ApiErrorSources } from '../../endpoint';
import { } from '../../../response/responseObjects';

export default define({
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {
	manager.success('create reference posting');
});
