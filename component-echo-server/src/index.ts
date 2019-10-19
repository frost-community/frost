import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	ActionOkResult
} from 'frost-core';

export default function(): IComponent {

	async function install(installApi: IComponentInstallApi): Promise<void> {
		console.log('server installation is finished');
	}

	async function boot(bootApi: IComponentBootApi): Promise<void> {
		bootApi.defineAction('echo', async (data) => {
			console.log('the action is called');

			const result: ActionOkResult = { data: data };
			return result;
		});

		console.log('server boot is finished');
	}

	return {
		name: 'echo-server',
		install: install,
		boot: boot
	};
};
