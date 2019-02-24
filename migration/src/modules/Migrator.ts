import IPatchInfo from './IPatchInfo';
import PatchApi from './PatchApi';
import { MongoProvider } from 'frost-core';

type PatchFunc = (patchApi: PatchApi) => Promise<void> | void;

export default class Migrator {
	private constructor(patches: IPatchInfo[], db: MongoProvider) {
		this.patches = patches;
		this.db = db;
	}

	private patches: IPatchInfo[];

	private db: MongoProvider;

	async migrate(dataVersion: number, targetDataVersion: number) {
		const generateProcedure = (current: number, patchProcedure: IPatchInfo[]) => {
			patchProcedure = patchProcedure || [];
			const nextPatch = this.patches.find(i => i.meta.from == current);
			if (!nextPatch) {
				return;
			}
			patchProcedure.push(nextPatch);
			if (nextPatch.meta.to == targetDataVersion) {
				return;
			}
			generateProcedure(nextPatch.meta.to, patchProcedure);
		};

		// generate migration procedure
		const patchProcedure: IPatchInfo[] = [];
		generateProcedure(dataVersion, patchProcedure);

		if (patchProcedure.length == 0) {
			throw new Error(
				'failed to generate migration procedure.\n'+
				'migration is not supported to the specified data version.\n' +
				`dataVersion=${dataVersion} targetDataVersion=${targetDataVersion} failedCode=1`);
		}

		const finalDataVersion = patchProcedure[patchProcedure.length-1].meta.to;
		if (finalDataVersion != targetDataVersion) {
			throw new Error(
				'failed to generate migration procedure.\n'+
				'migration is not supported to the specified data version.\n' +
				`dataVersion=${dataVersion} targetDataVersion=${targetDataVersion} failedCode=2`);
		}

		// execute migration
		for(const patch of patchProcedure) {
			await patch.func(this.db);
		}
	}

	static async FromPatchFunc(patchFunc: PatchFunc, db: MongoProvider): Promise<Migrator> {
		const patches: IPatchInfo[] = [];
		const patchApi = new PatchApi(patches);
		try {
			await patchFunc(patchApi);
		}
		catch(err) {
			console.error(err);
			throw new Error(`failed to execute patchFunc function`);
		}

		return new Migrator(patches, db);
	}
}
