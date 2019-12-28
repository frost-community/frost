import $ from 'cafy';
import { define, AuthScopes, ApiErrorSources } from '../../endpoints';
import { UserDocument, IUserDocument } from '../../../misc/documents';
import { UsersResponseObject } from '../../response/responseObjects';

export default define({
	params: {
	},
	scopes: [AuthScopes.userRead]
}, async (manager) => {

	const userDocRaws: (IUserDocument | null)[] = await manager.db.findArray('base.users', { });

	const userDocs: UserDocument[] = [];
	for (const userDocRaw of userDocRaws) {
		if (userDocRaw) {
			userDocs.push(new UserDocument(userDocRaw));
		}
	}

	const users = await manager.packAll(userDocs);

	manager.success(new UsersResponseObject(users));
});
