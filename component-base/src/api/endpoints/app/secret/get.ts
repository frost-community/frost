import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../../endpoints';
import { AppSecretResponseObject } from '../../../response/responseObjects';
import { IAppDocument, AppDocument } from '../../../documents';
import { ObjectIdContext } from '../../../../misc/cafyValidators';

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
