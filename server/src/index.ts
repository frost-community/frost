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
		description: 'Display server setting menu'
	});

	argv.option({
		name: 'componentSetting',
		type: 'boolean',
		description: 'Display component setting menu'
	});
	const { options } = argv.run();

	const initResult = await initializeServer();

	// mode: server setting menu

	if (options.serverSetting) {
		log('starting server menu ...');
		await showServerSettingMenu(initResult ? initResult.activeConfigManager : undefined);
		return;
	}

	// mode: main

	if (!initResult) {
		throw new Error('boot config is not found. please generate boot config on the server setting menu.');
	}

	const serverConfig = await loadServerConfig(initResult.activeConfigManager);

	const engine = new ComponentEngine(serverConfig.httpPort!, initResult.db, { });

	if (serverConfig.enableApi) {
		log('enable API component');
		engine.use(frostApi({ }));
	}

	if (serverConfig.enableWebApp) {
		log('enable WebApp component');
		engine.use(frostWeb({ }));
	}

	await engine.initializeComponents();

	if (options.componentSetting) {
		log('starting component menu ...');
		await engine.showComponentMenu();
		return;
	}

	log('starting engine ...');
	await engine.startComponents();
}

entryPoint()
.catch(err => {
	log(err);
});
