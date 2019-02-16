import { BootConfigManager, ActiveConfigManager, ConsoleMenu, inputLine, question } from 'frost-core';

/**
 * show menu of server setting.
 * @param activeConfigManager if ActiveConfigManager exists, specify it.
 */
export default async function(activeConfigManager?: ActiveConfigManager) {
	const menu = new ConsoleMenu('server setting menu');
	menu.add('close', () => true, (ctx) => {
		ctx.closeMenu();
	});
	menu.add('generate boot config', () => true, async (ctx) => {
		await BootConfigManager.showInit();
	});
	menu.add('configure server', () => (activeConfigManager != null), async (ctx) => {
		const isSetHttpPort = await question('do you set the httpPort? (y/n) > ');
		let httpPort: number | undefined = undefined;
		if (isSetHttpPort) {
			httpPort = parseInt(await inputLine('please input your httpPort > '));
			if (Number.isNaN(httpPort)) {
				console.log('httpPort is invalid value');
				return;
			}
		}
		const enableApi = await question('do you want to enable api component? (y/n) > ');
		const enableWebApp = await question('do you want to enable webapp component? (y/n) > ');

		console.log('configuring server ...');
		await activeConfigManager!.setItem('server', 'httpPort', httpPort);
		await activeConfigManager!.setItem('server', 'enableApi', enableApi);
		await activeConfigManager!.setItem('server', 'enableWebApp', enableWebApp);
		console.log('configured server.');
	});
	await menu.show();
}
