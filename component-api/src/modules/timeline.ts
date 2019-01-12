import { IChatPostingDocument, ChatPostingDocument } from './documents';
import { EndpointManager } from './Endpoint';
import { ObjectId } from 'mongodb';
import { IChatPosting } from './ApiResponse/packingObjects';

export default async function(manager: EndpointManager, userIds: ObjectId[]): Promise<IChatPosting[]> {
	const chatPostingRaws: IChatPostingDocument[] = await manager.db.findArray('api.postings', {
		type: 'chat',
		userId: { $in: userIds }
	});

	const chatPostingPromises = chatPostingRaws.map(chatPostingRaw => {
		const chatPostingDoc = new ChatPostingDocument(chatPostingRaw);
		return chatPostingDoc.pack(manager.db);
	});
	const chatPostings = await Promise.all(chatPostingPromises);

	return chatPostings;
}
