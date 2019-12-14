import { ConsoleMenu, ActiveConfigManager } from 'frost-core';

import showInitBootConfig from 'local/src/engine/showInitBootConfig';

/**
 * show menu of server setting.
 * @param activeConfigManager if ActiveConfigManager exists, specify it.
 */
export default async function(activeConfigManager?: ActiveConfigManager) {
	const menu = new ConsoleMenu('server setting menu');
	menu.add('* close menu *', () => true, (ctx) => {
		ctx.closeMenu();
	});
	menu.add('configure boot config', () => true, async (ctx) => {
		await showInitBootConfig();
	});
	// menu.add('configure server', () => (activeConfigManager != null), async (ctx) => {
	// 	// mongo url
	// 	mongoUrl = await inputLine('please set your MongoDB url (without db name) > ');

	// 	// mongo db name
	// 	dbName = await inputLine('please set your db name > ');

	// 	// http port
	// 	const isSetHttpPort = await question('do you set the httpPort? (y/n) > ');
	// 	if (isSetHttpPort) {
	// 		httpPort = parseInt(await inputLine('please input your httpPort > '));
	// 		if (Number.isNaN(httpPort)) {
	// 			console.log('httpPort is invalid value');
	// 			return;
	// 		}
	// 	}
	// 	else {
	// 		httpPort = undefined;
	// 	}

	// 	const enableApi = await question('do you want to enable api component? (y/n) > ');
	// 	const enableWebApp = await question('do you want to enable webapp component? (y/n) > ');

	// 	console.log('configuring server ...');
	// 	await activeConfigManager!.setItem('server', 'enableApi', enableApi);
	// 	await activeConfigManager!.setItem('server', 'enableWebApp', enableWebApp);
	// 	console.log('configured server.');
	// });
	await menu.show();
}
