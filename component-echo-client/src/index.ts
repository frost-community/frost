import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	ConsoleMenu
} from 'frost-core';

import {
	IEchoServerApi
} from 'component-echo-server';

class EchoClientComponent implements IComponent {
	name: string = 'echo-client';
	dependencies: string[] = ['echo-server'];

	async install(ctx: IComponentInstallApi): Promise<void> {
		const menu = new ConsoleMenu('setting menu of echo client');
		menu.add('* close menu *', () => true, (ctx) => ctx.closeMenu());
		ctx.registerSetupMenu(menu);
		console.log('client installation is finished');
	}

	async boot(ctx: IComponentBootApi): Promise<any> {
		const echoServer: IEchoServerApi = ctx.use('echo-server');

		// use component api test
		const sendMessage = 'hello';
		console.log('send message:', sendMessage);
		const echoMessage = echoServer.echo(sendMessage);
		console.log('echo message:', echoMessage);

		console.log('client boot is finished');
		return { };
	}
}

export default () => new EchoClientComponent();
