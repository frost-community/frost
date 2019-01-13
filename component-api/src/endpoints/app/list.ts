import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { AppsResponseObject } from '../../modules/ApiResponse/ResponseObject';
import { } from '../../modules/cafyValidators';

export default define({
	params: {
		//userId: ObjectIdValidator
	},
	scopes: [AuthScopes.appRead]
}, async (manager) => {

	// temporary
	const user = await manager.userService.findByScreenName('test');
	if (!user) {
		manager.error(ApiErrorSources.serverError);
		return;
	}

	const {
		// userId
	} = manager.params;

	const appDocs = await manager.appService.findArrayByCreatorId(user._id);
	const apps = await manager.packAll(appDocs);

	manager.ok(new AppsResponseObject(apps));
});
