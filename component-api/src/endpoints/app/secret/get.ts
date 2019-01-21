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

	if (appDoc.existsAppSecret()) {
		manager.error(ApiErrorSources.appSecretNotCreated);
		return;
	}

	const appSecret = await appDoc.getAppSecret(manager.config);

	manager.ok(new AppSecretResponseObject({
		appId: appDocRaw._id.toHexString(),
		appSecret: appSecret
	}));
});
