import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../modules/Endpoint';
import { AppSecretResponseObject } from '../../../modules/ApiResponse/ResponseObject';
import { IAppDocument, AppDocument } from '../../../modules/documents';
import { ObjectIdValidator } from '../../../modules/cafyValidators';

export default define({
	params: {
		appId: ObjectIdValidator
	},
	scopes: [AuthScopes.appHost]
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

	if (appDocRaw.root) {
		manager.error(ApiErrorSources.cannnotCreateRootAppSecret);
		return;
	}

	const appSecret = await appDoc.generateAppSecret(manager.db);

	manager.ok(new AppSecretResponseObject({
		appId: appDocRaw._id.toHexString(),
		appSecret: appSecret
	}));
});
