import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	ActionOkResult
} from 'frost-core';

class EchoServerComponent implements IComponent {
	name: string = 'echo-server';
	dependencies: string[] = [];
	api: any = { };

	async install(ctx: IComponentInstallApi): Promise<void> {
		console.log('server installation is finished');
	}

	async boot(ctx: IComponentBootApi): Promise<void> {
		ctx.defineAction('echo', async (data) => {
			console.log('the action is called');

			const result: ActionOkResult = { data: data };
			return result;
		});

		ctx.addEventListener('show-message', (data) => {
			console.log('message:', data.message);
		});

		console.log('server boot is finished');
	}
}

export default () => new EchoServerComponent();
