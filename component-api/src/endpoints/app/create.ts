import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { AppResponseObject } from '../../modules/ApiResponse/ResponseObject';
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

	// temporary
	const user = await manager.userService.findByScreenName('test');
	if (!user) {
		manager.error(ApiErrorSources.serverError);
		return;
	}

	const {
		name,
		description = '',
		scopes = []
	} = manager.params;

	// if app name is duplicated
	const tempApp = await manager.db.find('api.apps', { name: name });
	if (tempApp) {
		manager.error(ApiErrorSources.duplicatedAppName);
		return;
	}

	let appDoc: AppDocument;
	try {
		appDoc = await manager.appService.create(name, user, description, scopes);
	}
	catch (err) {
		console.error(err);
		manager.error(ApiErrorSources.serverError, { message: 'failed to create an app' });
		return;
	}

	const app = await appDoc.pack(manager.db);

	manager.ok(new AppResponseObject(app));
});
