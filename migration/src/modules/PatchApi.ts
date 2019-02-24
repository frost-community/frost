import { MongoProvider } from 'frost-core';
import IPatchInfo from './IPatchInfo';
import IPatchMeta from './IPatchMeta';

export default class PatchApi {
	constructor(patches: IPatchInfo[]) {
		this.patches = patches;
	}

	private patches: IPatchInfo[];

	define(meta: IPatchMeta, func: (db: MongoProvider) => Promise<void> | void) {
		this.patches.push({ meta, func });
	}
}
