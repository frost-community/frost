import $ from 'cafy';
import { ServerEngine } from './engine';
import log from './log';
import path from 'path';

// interface IServerConfig {
// 	usingComponents: string[];
// }

// function loadServerConfig() {
// 	log('loading server config ...');

// 	let serverConfig: IServerConfig;
// 	if (process.env.FROST_SERVER != null) {
// 		log(`loading server config from FROST_BOOT FROST_SERVER variable ...`);
// 		serverConfig = JSON.parse(process.env.FROST_SERVER) as IServerConfig;
// 	}
// 	else {
// 		log(`loading server config from server-config.json ...`);
// 		serverConfig = require(`../.configs/server-config.json`) as IServerConfig;
// 	}

// 	try {
// 		// verify server config
// 		const verificationServerConfig = $.obj({
// 			usingComponents: $.array($.str)
// 		});
// 		if (verificationServerConfig.nok(serverConfig)) {
// 			throw new Error('invalid server config');
// 		}
// 		log('loaded server config.');
// 	}
// 	catch {
// 		throw new Error('server is not configured. please configure on the server setting menu.');
// 	}

// 	return serverConfig;
// }

async function entryPoint() {

	console.log('===========');
	console.log('  * Frost  ');
	console.log('===========');

	const serverEngine = new ServerEngine();

	// const serverConfig = loadServerConfig();

	// for (const usingComponent of serverConfig.usingComponents) {
	// 	let component: any;
	// 	try {
	// 		component = require(usingComponent);
	// 	}
	// 	catch (err) {
	// 		log(`failed to load ${usingComponent} component`);
	// 		continue;
	// 	}
	// 	if (component.default) {
	// 		component = component.default;
	// 	}
	// 	serverEngine.use(component());
	// 	log(`${usingComponent} component is enabled`);
	// }

	await serverEngine.start(path.resolve(__dirname, '../.configs/boot-config.json'));
}

entryPoint()
.catch(err => {
	log(err);
});
