import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from 'local/src/api/routing/endpoint';
import { AppSecretResponseObject } from 'local/src/api/response/responseObjects';
import { IAppDocument, AppDocument } from 'local/src/api/documents';
import { ObjectIdContext } from 'local/src/misc/cafyValidators';

export default define({
	params: {
		appId: $.type(ObjectIdContext)
	},
	scopes: [AuthScopes.appHost]
}, async (manager) => {

	// params
	const appId: string = manager.params.appId;

	const appDocRaw: IAppDocument = await manager.db.findById('base.apps', appId);
	if (!appDocRaw) {
		manager.error(ApiErrorSources.appNotFound);
		return;
	}
	const appDoc: AppDocument = new AppDocument(appDocRaw);

	if (appDoc.existsAppSecret()) {
		manager.error(ApiErrorSources.appSecretNotCreated);
		return;
	}

	// population
	await appDoc.populate(manager.db);

	const appSecret = await appDoc.getAppSecret(manager.activeConfigManager);

	manager.success(new AppSecretResponseObject({
		appId: appDocRaw._id.toHexString(),
		app: await appDoc.pack(manager.db),
		appSecret: appSecret
	}));
});
