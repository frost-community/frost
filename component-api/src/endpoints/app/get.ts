import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { AppResponseObject } from '../../modules/apiResponse/responseObjects';
import { AppDocument, IAppDocument } from '../../modules/documents';
import { ObjectIdValidator } from '../../modules/cafyValidators';

export default define({
	params: {
		appId: ObjectIdValidator
	},
	scopes: [AuthScopes.appRead]
}, async (manager) => {

	const {
		appId
	} = manager.params;

	const appDocRaw: IAppDocument = await manager.db.findById('api.apps', appId);
	if (!appDocRaw) {
		manager.error(ApiErrorSources.appNotFound);
		return;
	}
	const appDoc = new AppDocument(appDocRaw);

	const app = await appDoc.pack(manager.db);

	manager.ok(new AppResponseObject(app));
});
