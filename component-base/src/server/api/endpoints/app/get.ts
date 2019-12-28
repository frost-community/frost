import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../endpoints';
import { AppResponseObject } from '../../response/responseObjects';
import { AppDocument, IAppDocument } from '../../../misc/documents';
import { ObjectIdContext } from '../../misc/cafyValidators';

export default define({
	params: {
		appId: $.type(ObjectIdContext)
	},
	scopes: [AuthScopes.appRead]
}, async (manager) => {

	// params
	const appId: string = manager.params.appId;

	const appDocRaw: IAppDocument = await manager.db.findById('base.apps', appId);
	if (!appDocRaw) {
		manager.error(ApiErrorSources.appNotFound);
		return;
	}
	const appDoc = new AppDocument(appDocRaw);

	await appDoc.populate(manager.db);
	const app = await appDoc.pack(manager.db);

	manager.success(new AppResponseObject(app));
});
