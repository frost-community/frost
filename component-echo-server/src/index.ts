import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi
} from 'frost-core';

export interface IEchoServerApi {
	echo(message: string): string;
}

class EchoServerApi implements IEchoServerApi {
	echo(message: string): string {
		return message;
	}
}

class EchoServerComponent implements IComponent {
	name: string = 'echo-server';
	dependencies: string[] = [];

	async install(ctx: IComponentInstallApi): Promise<void> {
		console.log('server installation is finished');
	}

	async boot(ctx: IComponentBootApi): Promise<IEchoServerApi> {
		const api = new EchoServerApi();

		console.log('server boot is finished');
		return api;
	}
}

export default () => new EchoServerComponent();
