import { define, AuthScopes, ApiResultType, ApiErrorSources } from '../../modules/Endpoint';

export default define({ }, async (manager) => {
	manager.ok({ resultType: ApiResultType.Message, result: 'info' });
});
