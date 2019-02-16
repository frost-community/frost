import PatchApi from '../modules/PatchApi';

export default function(patchApi: PatchApi) {
	patchApi.define({
		from: 1,
		to: 2
	}, async (db) => {
		// (rename collection) meta -> api.meta
		await db.rename('meta', 'api.meta');
	});
}
