import { define, AuthScopes, ApiResultType, ApiErrorSources } from '../../modules/Endpoint';

export default define({
	scopes: [AuthScopes.postingWrite]
}, async (manager) => {
	manager.ok({ resultType: ApiResultType.Message, result: 'create article posting' });
});
