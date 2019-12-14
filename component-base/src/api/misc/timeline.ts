import { ObjectId } from 'mongodb';
import { IChatPostingDocument, ChatPostingDocument } from 'local/src/api/documents';
import { EndpointManager } from 'local/src/api/routing/endpoint';
import { IChatPosting } from 'local/src/api/response/packingObjects';

export default async function(manager: EndpointManager, userIds: ObjectId[]): Promise<IChatPosting[]> {
	const chatPostingRaws: IChatPostingDocument[] = await manager.db.findArray('base.postings', {
		type: 'chat',
		userId: { $in: userIds }
	});
	const chatPostingDocs = chatPostingRaws.map(docRaw => new ChatPostingDocument(docRaw));

	await manager.populateAll(chatPostingDocs);
	return manager.packAll(chatPostingDocs);
}
