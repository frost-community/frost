import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { AppsResponseObject } from '../../modules/apiResponse/responseObjects';
import { } from '../../modules/cafyValidators';

export default define({
	params: {
		//userId: ObjectIdValidator
	},
	scopes: [AuthScopes.appRead]
}, async (manager) => {

	const account = manager.authInfo!.user;

	const {
		// userId
	} = manager.params;

	const appDocs = await manager.appService.findArrayByCreatorId(account._id);
	const apps = await manager.packAll(appDocs);

	manager.ok(new AppsResponseObject(apps));
});
