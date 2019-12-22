import path from 'path';
import { ServerEngine } from './engine';

function log(...params: any[]) {
	console.log('[Server]', ...params);
}

async function entryPoint() {

	console.log('===========');
	console.log('  * Frost  ');
	console.log('===========');

	const bootConfigPath = path.resolve(__dirname, '../.configs/boot-config.json');

	const engine = new ServerEngine();
	await engine.start(bootConfigPath);
}

entryPoint()
.catch(err => {
	log('error:', err);
});
