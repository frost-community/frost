import { ConsoleMenu, IComponent } from 'frost-core';

export interface SetupItem {
	component: IComponent;
	setupMenu: ConsoleMenu;
}

export default async function(setupItems: SetupItem[]) {
	const componentMenu = new ConsoleMenu('Select a component to setup');

	componentMenu.add('* close menu *', () => true, (ctx) => ctx.closeMenu());
	for (const setupMenu of setupItems) {
		componentMenu.add(setupMenu.component.name, () => true, async (ctx) => {
			await setupMenu.setupMenu.show();
		});
	}

	await componentMenu.show();
}
