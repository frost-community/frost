import { ConsoleMenu, IComponent, inputLine, ActiveConfigManager, verifyComponent } from 'frost-core';

export interface SetupItem {
	component: IComponent;
	setupMenu: ConsoleMenu;
}

async function showComponentConfigMenu(setupItems: SetupItem[]) {
	const menu = new ConsoleMenu('Select a component to configure');

	menu.add('* close menu *', () => true, (ctx) => ctx.closeMenu());
	for (const setupMenu of setupItems) {
		menu.add(setupMenu.component.name, () => true, async (ctx) => {
			await setupMenu.setupMenu.show();
		});
	}

	await menu.show();
}

export default async function(setupItems: SetupItem[], activeConfigManager: ActiveConfigManager) {
	const menu = new ConsoleMenu('server config menu');

	menu.add('* close menu *', () => true, (ctx) => ctx.closeMenu());

	menu.add('add a component to the server', () => true, async (ctx) => {
		const packageName = await inputLine('input the package name of the component > ');

		let componentFn;
		try {
			componentFn = require(packageName);
			if (componentFn.default) {
				componentFn = componentFn.default;
			}
		}
		catch (err) {
			console.log('Error: failed to load the component.');
			return;
		}
		if (componentFn != null && typeof componentFn != 'function') {
			console.log('Error: component module must be a function that returns IComponent.');
			return;
		}
		let component: IComponent = componentFn();
		if (!verifyComponent(component)) {
			console.log('Error: failed to load the component.');
			return;
		}

		console.log(`adding ${component.name} component ...`);
		const components: string[] = await activeConfigManager.getItem('server', 'components');
		components.push(packageName);
		await activeConfigManager.setItem('server', 'components', components);
		console.log(`specified component was added to the server.`);
	});

	menu.add('remove a component from the server', () => true, async (ctx) => {
		const packageName = await inputLine('input the package name of the component > ');

		const components: string[] = await activeConfigManager.getItem('server', 'components');
		const index = components.indexOf(packageName);
		if (index == -1) {
			console.log('Error: package name is invalid.');
			return;
		}

		components.splice(index, 1);
		await activeConfigManager.setItem('server', 'components', components);
		console.log(`specified component has been removed from the server.`);
	});

	menu.add('configure components', () => true, async (ctx) => {
		await showComponentConfigMenu(setupItems);
	});

	await menu.show();
}
