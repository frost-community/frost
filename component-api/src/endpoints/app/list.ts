import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { AppsResponseObject } from '../../modules/ApiResponse/ResponseObject';
import { AppDocument } from '../../modules/documents';
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

	const appDocs: AppDocument[] = await manager.appService.findArrayByCreatorId(user._id);
	const appPromises = appDocs.map(appDoc => appDoc.pack(manager.db));
	const apps = await Promise.all(appPromises);

	manager.ok(new AppsResponseObject(apps));
});
