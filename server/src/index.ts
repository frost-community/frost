import path from 'path';
import { ServerEngine } from './engine';
import { InputCanceledError } from 'frost-core';

function log(...params: any[]) {
	console.log('[Server]', ...params);
}

async function entryPoint() {

	console.log('===========');
	console.log('  * Frost  ');
	console.log('===========');

	const bootConfigPath = path.resolve(__dirname, '../.configs/boot-config.json');

	const engine = new ServerEngine();

	try {
		await engine.start(bootConfigPath);
	}
	catch (err) {
		if (err instanceof InputCanceledError) {

		}
		else {
			throw err;
		}
	}
}

entryPoint()
.catch(err => {
	log(err);
});
