import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi
} from 'frost-core';

export interface IBaseApi {
	getVersion(): { major: number, minor: number };
}

class BaseApi implements IBaseApi {
	getVersion() {
		return { major: 1, minor: 0 };
	}
}

class BaseComponent implements IComponent {
	name: string = 'base';
	dependencies: string[] = [];

	async install(ctx: IComponentInstallApi): Promise<void> {

	}

	async boot(ctx: IComponentBootApi): Promise<IBaseApi> {
		const api = new BaseApi();

		return api;
	}
}

export default () => new BaseComponent();
