import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	isActionOkResult
} from 'frost-core';

export default function(): IComponent {

	async function install(installApi: IComponentInstallApi): Promise<void> {
		console.log('client installation is finished');
	}

	async function boot(bootApi: IComponentBootApi): Promise<void> {
		try {
			const callData = { message: 'hello' };
			console.log('the client send data:', callData);
			const result = await bootApi.callAction('echo-server', 'echo', callData);
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

		console.log('client boot is finished');
	}

	return {
		name: 'echo-client',
		install: install,
		boot: boot
	};
};
