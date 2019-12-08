import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/endpoint';
import { UserResponseObject } from '../../modules/apiResponse/responseObjects';
import { IUserDocument, UserDocument } from '../../modules/documents';

export default define({
	params: {
		name: $.str.optional.range(1, 32),
		description: $.str.optional.range(0, 256)
	},
	scopes: [AuthScopes.userWrite]
}, async (manager) => {

	const account = manager.authInfo!.user;

	// params
	const name: string | undefined = manager.params.name;
	const description: string | undefined = manager.params.description;

	const source: any = { };

	if (name)
		source.name = name;

	if (description)
		source.description = description;

	if (Object.keys(source).length == 0) {
		manager.error(ApiErrorSources.missingParam, { message: 'specify some optional params' });
		return;
	}

	let userDocRaw: IUserDocument;
	try {
		userDocRaw = await manager.db.updateById('base.users', account._id, source);
	}
	catch (err) {
		manager.error(ApiErrorSources.serverError, { message: 'failed to update user' });
		return;
	}

	const userDoc = new UserDocument(userDocRaw);
	const user = await userDoc.pack(manager.db);

	manager.success(new UserResponseObject(user));
});
