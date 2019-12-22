import inputLine from './inputLine';
import $ from 'cafy';

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

type ConsoleMenuItem =
	{ description: string, enable: () => Promise<boolean> | boolean, func: (ctx: { closeMenu: () => void }) => Promise<void> | void };

export default class ConsoleMenu {
	constructor(menuName: string) {
		this.menuName = menuName;
		this.isCloseMenu = false;
		this.items = [];
	}

	menuName: string;

	items: ConsoleMenuItem[];

	private isCloseMenu: boolean;

	add(description: string, enable: () => Promise<boolean> | boolean, func: (ctx: { closeMenu: () => void }) => Promise<void> | void) {
		this.items.push({ description, enable, func });
	}

	async show() {
		while (!this.isCloseMenu) {
			console.log();
			console.log(`<${this.menuName}>`);

			const enableIndexList = await Promise.all(this.items.map(i => i.enable()));
			const enabledItems: ConsoleMenuItem[] = [];
			for (let i = 0; i < this.items.length; i++) {
				if (enableIndexList[i]) {
					enabledItems.push(this.items[i])
				}
			}

			for (let i = 0; i < enabledItems.length; i++) {
				if (await enabledItems[i].enable()) {
					console.log(`${i}: ${enabledItems[i].description}`);
				}
			}
			const index = parseInt(await inputLine('> '));
			if ($.number.max(enabledItems.length - 1).ok(index)) {
				await enabledItems[index].func({ closeMenu: () => { this.isCloseMenu = true; }});
			}
			await delay(100);
		}
	}
}
