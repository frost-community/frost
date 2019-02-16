import { MongoProvider } from 'frost-core';
import IPatchInfo from './IPatchInfo';
import IPatchMeta from './IPatchMeta';

//export type Patch = (patchApi: PatchApi) => Promise<void> | void;

export default class PatchApi {
	constructor(componentName: string) {
		this.componentName = componentName;
		this.patches = [];
	}

	readonly componentName: string;

	readonly patches: IPatchInfo[];

	define(meta: IPatchMeta, func: (db: MongoProvider) => Promise<void> | void) {
		this.patches.push({ meta, func });
	}
}
