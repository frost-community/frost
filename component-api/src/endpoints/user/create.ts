import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { UserResponseObject } from '../../modules/ApiResponse/ResponseObject';
import UserService from '../../services/UserService';

export default define({
	scopes: [AuthScopes.userCreate]
}, async (manager) => {
	const userService = new UserService(manager.db);

	const screenNameVerification = $.str.range(4, 15).match(/^[a-zA-Z0-9_-]+$/);
	if (!screenNameVerification.isOptional && $.any.nok(manager.params.screenName)) {
		manager.error(ApiErrorSources.MissingParam, { paramName: 'screenName' });
		return;
	}
	const [screenName, errorScreenName] = screenNameVerification.get(manager.params.screenName);
	if (errorScreenName) {
		manager.error(ApiErrorSources.InvalidParamFormat, { paramName: 'screenName' });
		return;
	}

	const passwordVerification = $.str.min(8);
	if (!passwordVerification.isOptional && $.any.nok(manager.params.password)) {
		manager.error(ApiErrorSources.MissingParam, { paramName: 'password' });
		return;
	}
	const [password, errorPassword] = passwordVerification.get(manager.params.password);
	if (errorPassword) {
		manager.error(ApiErrorSources.InvalidParamFormat, { paramName: 'password' });
		return;
	}

	const [name = 'froster', errorName] = $.str.optional.range(1, 32).get(manager.params.name);

	const [description = '', errorDescription] = $.str.optional.range(0, 256).match(/^[a-zA-Z0-9_-]+$/).get(manager.params.description);

	const userDoc = await userService.create(screenName, password, name, description);

	const user = await userDoc.pack(manager.db);
	manager.ok(new UserResponseObject(user));
});
