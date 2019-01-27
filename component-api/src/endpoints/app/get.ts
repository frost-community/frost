import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { AppResponseObject } from '../../modules/apiResponse/responseObjects';
import { AppDocument, IAppDocument } from '../../modules/documents';
import { ObjectIdContext } from '../../modules/cafyValidators';

export default define({
	params: {
		appId: $.type(ObjectIdContext)
	},
	scopes: [AuthScopes.appRead]
}, async (manager) => {

	// params
	const appId: string = manager.params.appId;

	const appDocRaw: IAppDocument = await manager.db.findById('api.apps', appId);
	if (!appDocRaw) {
		manager.error(ApiErrorSources.appNotFound);
		return;
	}
	const appDoc = new AppDocument(appDocRaw);

	await appDoc.populate(manager.db);
	const app = await appDoc.pack(manager.db);

	manager.ok(new AppResponseObject(app));
});
