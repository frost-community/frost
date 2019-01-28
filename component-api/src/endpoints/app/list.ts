import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { AppsResponseObject } from '../../modules/apiResponse/responseObjects';
import { } from '../../modules/cafyValidators';

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

	manager.ok(new AppsResponseObject(apps));
});
