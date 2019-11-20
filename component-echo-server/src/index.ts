import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi
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
		console.log('server boot is finished');
	}
}

export default () => new EchoServerComponent();
