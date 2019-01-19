import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { UserResponseObject } from '../../modules/apiResponse/responseObjects';
import { UserDocument } from '../../modules/documents';

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

	let userDoc: UserDocument;
	try {
		userDoc = await manager.userService.create(screenName, password, name, description);
	}
	catch (err) {
		console.error(err);
		manager.error(ApiErrorSources.serverError, { message: 'failed to create user' });
		return;
	}

	const user = await userDoc.pack(manager.db);
	manager.ok(new UserResponseObject(user));
});
