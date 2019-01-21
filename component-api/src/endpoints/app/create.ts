import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { AppResponseObject } from '../../modules/apiResponse/responseObjects';
import { AppDocument } from '../../modules/documents';

function isAvailableScope(scopeId: string): boolean {
	const scope = AuthScopes.toArray().find(s => s.id == scopeId);

	return scope != null && scope.grantable;
}

export default define({
	params: {
		name: $.str.range(1, 32),
		description: $.str.optional.max(256),
		scopes: $.array($.str.pipe(scope => isAvailableScope(scope))).optional.unique()
	},
	scopes: [AuthScopes.appCreate]
}, async (manager) => {

	const account = manager.authInfo!.user;

	// params
	const name: string = manager.params.name;
	const description: string = manager.params.description || '';
	const scopes: string[] = manager.params.scopes || [];

	// if app name is duplicated
	const tempApp = await manager.db.find('api.apps', { name: name });
	if (tempApp) {
		manager.error(ApiErrorSources.duplicatedAppName);
		return;
	}

	let appDoc: AppDocument;
	try {
		appDoc = await manager.appService.create(name, account, description, scopes);
	}
	catch (err) {
		console.error(err);
		manager.error(ApiErrorSources.serverError, { message: 'failed to create an app' });
		return;
	}

	const app = await appDoc.pack(manager.db);

	manager.ok(new AppResponseObject(app));
});
