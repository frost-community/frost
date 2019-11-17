import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	ActionOkResult
} from 'frost-core';

export interface IApi {
	echo(message: string): string;
}

class Api implements IApi {
	echo(message: string): string {
		return message;
	}
}

class EchoServerComponent implements IComponent {
	name: string = 'echo-server';
	dependencies: string[] = [];
	api: IApi = new Api();

	async install(ctx: IComponentInstallApi): Promise<void> {
		console.log('server installation is finished');
	}

	async boot(ctx: IComponentBootApi): Promise<void> {
		// action test
		ctx.defineAction('echo', async (data) => {
			console.log('the action is called');

			const result: ActionOkResult = { data: data };
			return result;
		});

		// event test
		ctx.addEventListener('show-message', (data) => {
			console.log('message:', data.message);
		});

		console.log('server boot is finished');
	}
}

export default () => new EchoServerComponent();
