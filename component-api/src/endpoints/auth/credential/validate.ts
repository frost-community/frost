import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/endpoint';
import { CredentialValidationResponseObject } from '../../../modules/apiResponse/responseObjects';

export default define({
	params: {
		screenName: $.str.range(4, 15).match(/^[a-zA-Z0-9_-]+$/),
		password: $.str.min(8)
	},
	scopes: [AuthScopes.authHost]
}, async (manager) => {

	const {
		screenName,
		password
	} = manager.params;

	const userDoc = await manager.userService.findByScreenName(screenName);
	if (!userDoc) {
		manager.ok(new CredentialValidationResponseObject({
			isValid: false
		}));
		return;
	}

	const isValid = userDoc.validatePassword(password);

	manager.ok(new CredentialValidationResponseObject({
		isValid: isValid
	}));
});
