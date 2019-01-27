import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/endpoint';
import { AppSecretResponseObject } from '../../../modules/apiResponse/responseObjects';
import { IAppDocument, AppDocument } from '../../../modules/documents';
import { ObjectIdContext } from '../../../modules/cafyValidators';

export default define({
	params: {
		appId: $.type(ObjectIdContext)
	},
	scopes: [AuthScopes.appHost]
}, async (manager) => {

	// params
	const appId: string = manager.params.appId;

	const appDocRaw: IAppDocument = await manager.db.findById('api.apps', appId);
	if (!appDocRaw) {
		manager.error(ApiErrorSources.appNotFound);
		return;
	}
	const appDoc: AppDocument = new AppDocument(appDocRaw);

	if (appDocRaw.root) {
		manager.error(ApiErrorSources.cannnotCreateRootAppSecret);
		return;
	}

	// population
	await appDoc.populate(manager.db);

	const appSecret = await appDoc.generateAppSecret(manager.db);

	manager.ok(new AppSecretResponseObject({
		appId: appDocRaw._id.toHexString(),
		app: await appDoc.pack(manager.db),
		appSecret: appSecret
	}));
});
