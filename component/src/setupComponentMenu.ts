import ConsoleMenu from './ConsoleMenu';
import IComponent from './IComponent';

export default async function(setupMenus: { component: IComponent, setupMenu: ConsoleMenu }[]) {

	const componentMenu = new ConsoleMenu('Select a component to setup');

	componentMenu.add(' * close menu * ', () => true, (ctx) => ctx.closeMenu());
	for (const setupMenu of setupMenus) {
		componentMenu.add(setupMenu.component.name, () => true, async (ctx) => {
			await setupMenu.setupMenu.show();
		});
	}

	await componentMenu.show();
	console.log();
}
