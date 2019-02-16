import argv from 'argv';
import { ComponentEngine } from 'frost-component';
import frostApi from 'frost-component-api';
import frostWeb from 'frost-component-webapp';
import log from './modules/log';
import initializeServer from './modules/initializeServer';
import showServerSettingMenu from './modules/showServerSettingMenu';
import loadServerConfig from './modules/loadServerConfig';

async function entryPoint() {

	console.log('===========');
	console.log('  * Frost  ');
	console.log('===========');

	// * option args

	argv.option({
		name: 'serverSetting',
		type: 'boolean',
		description: 'Display initialization mode'
	});
	argv.option({
		name: 'setup',
		type: 'boolean',
		description: 'Display setup mode'
	});
	const { options } = argv.run();

	const initResult = await initializeServer();

	// mode: server setting menu

	if (options.serverSetting) {
		await showServerSettingMenu(initResult ? initResult.activeConfigManager : undefined);
		return;
	}

	// mode: main

	if (!initResult) {
		throw new Error('boot config is not found. please generate boot config on the server setting menu.');
	}

	const serverConfig = await loadServerConfig(initResult.activeConfigManager);

	const engine = new ComponentEngine(serverConfig.httpPort!, initResult.bootConfig.mongo, { });

	if (serverConfig.enableApi) {
		log('enable API component');
		engine.use(frostApi({ }));
	}

	if (serverConfig.enableWebApp) {
		log('enable WebApp component');
		engine.use(frostWeb({ }));
	}

	log('starting engine ...');
	await engine.start();
}

entryPoint()
.catch(err => {
	log(err);
});
