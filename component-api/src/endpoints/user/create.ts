import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { UserResponseObject } from '../../modules/ApiResponse/ResponseObject';

export default define({
	params: {
		screenName: $.str.range(4, 15).match(/^[a-zA-Z0-9_-]+$/),
		password: $.str.min(8),
		name: $.str.optional.range(1, 32),
		description: $.str.optional.range(0, 256)
	},
	scopes: [AuthScopes.userCreate]
}, async (manager) => {
	const {
		screenName,
		password,
		name = 'froster',
		description = ''
	} = manager.params;

	// check availability of ScreenName
	if (await manager.userService.findByScreenName(screenName)) {
		manager.error(ApiErrorSources.duplicatedScreenName);
		return;
	}

	const userDoc = await manager.userService.create(screenName, password, name, description);
	if (!userDoc) {
		manager.error(ApiErrorSources.serverError, { message: 'failed to create user' });
		return;
	}

	const user = await userDoc.pack(manager.db);
	manager.ok(new UserResponseObject(user));
});
