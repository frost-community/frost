import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from 'local/src/api/routing/endpoint';
import { AppsResponseObject } from 'local/src/api/response/responseObjects';
import { } from 'local/src/misc/cafyValidators';

export default define({
	params: {
		//userId: $.type(ObjectIdContext)
	},
	scopes: [AuthScopes.appRead]
}, async (manager) => {

	const account = manager.authInfo!.user;

	// params
	//const userId: string = manager.params.userId;

	const appDocs = await manager.appService.findArrayByCreatorId(account._id);

	await manager.populateAll(appDocs);
	const apps = await manager.packAll(appDocs);

	manager.success(new AppsResponseObject(apps));
});
