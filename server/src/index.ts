import path from 'path';
import { ServerEngine } from 'local/src/engine';
import log from 'local/src/log';

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
