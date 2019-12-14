import { define, AuthScopes, ApiErrorSources } from 'local/src/api/routing/endpoint';
import { } from 'local/src/api/response/responseObjects';

export default define({ }, async (manager) => {
	manager.success('frozen crystal');
});
