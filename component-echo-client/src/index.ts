import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	isActionOkResult,
	ConsoleMenu
} from 'frost-core';

import {
	IApi as IEchoServerApi
} from 'component-echo-server';

class EchoClientComponent implements IComponent {
	name: string = 'echo-client';
	dependencies: string[] = ['echo-server'];
	api: any = { };

	async install(ctx: IComponentInstallApi): Promise<void> {
		const menu = new ConsoleMenu('setting menu of echo client');
		menu.add('* close menu *', () => true, (ctx) => ctx.closeMenu());
		ctx.registerSetupMenu(menu);
		console.log('client installation is finished');
	}

	async boot(ctx: IComponentBootApi): Promise<void> {
		const echoServer: IEchoServerApi = ctx.use('echo-server');

		// use component api test
		const sendMessage = 'hello';
		console.log('send message:', sendMessage);
		const echoMessage = echoServer.echo(sendMessage);
		console.log('echo message:', echoMessage);

		// action test
		try {
			const callData = { message: 'hello' };
			console.log('the client send data:', callData);
			const result = await ctx.callAction('echo-server', 'echo', callData);
			if (isActionOkResult(result)) {
				console.log('ok result received:', result.data);
			}
			else {
				console.log('error result received:', result.error);
			}
		}
		catch(err) {
			console.log('internal error:', err);
		}

		// event test
		ctx.emitEvent('echo-server', 'show-message', { message: 'nya' });

		console.log('client boot is finished');
	}
}

export default () => new EchoClientComponent();
