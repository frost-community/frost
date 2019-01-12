import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../modules/Endpoint';
import { UserDocument, IUserDocument } from '../../modules/documents';
import { IUser } from '../../modules/ApiResponse/packingObjects';
import { UsersResponseObject } from '../../modules/ApiResponse/ResponseObject';

export default define({
	params: {
	},
	scopes: [AuthScopes.userRead]
}, async (manager) => {
	const {
	} = manager.params;

	const userDocRaws: (IUserDocument | null)[] = await manager.db.findArray('api.users', { });

	let users: IUser[] = [];
	for (const userDocRaw of userDocRaws) {
		if (!userDocRaw) continue;
		const userDoc = new UserDocument(userDocRaw);
		const user = await userDoc.pack(manager.db);
		users.push(user);
	}

	manager.ok(new UsersResponseObject(users));
});
