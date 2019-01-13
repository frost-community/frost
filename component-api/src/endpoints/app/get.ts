import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { AppResponseObject } from '../../modules/ApiResponse/ResponseObject';
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
