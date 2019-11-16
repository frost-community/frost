import { ServerEngine } from './engine';
import log from './log';
import path from 'path';

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
	log(err);
});
