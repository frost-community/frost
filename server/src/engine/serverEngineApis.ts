import { EventEmitter } from 'events';
import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	IComponentLink,
	MongoProvider,
	ConsoleMenu
} from 'frost-core';
import { SetupItem } from './showServerMenu';

export class InstallApi implements IComponentInstallApi {
	constructor(component: IComponent, db: MongoProvider, setupItems: SetupItem[]) {
		this.db = db;
		this.component = component;
		this.setupItems = setupItems;
	}

	db: MongoProvider;
	component: IComponent;
	setupItems: SetupItem[];

	registerSetupMenu(setupMenu: ConsoleMenu): void {
		this.setupItems.push({ component: this.component, setupMenu: setupMenu });
	}
}

export class BootApi implements IComponentBootApi {
	constructor(component: IComponent, components: IComponent[], apis: any[], db: MongoProvider, messenger: EventEmitter) {
		this.db = db;
		this.component = component;
		this.components = components;
		this.messenger = messenger;
		this.apis = apis;
	}

	db: MongoProvider;
	component: IComponent;
	components: IComponent[];
	messenger: EventEmitter;
	apis: any[];

	use(componentName: string): IComponentLink {
		if (this.component.dependencies.indexOf(componentName) == -1) {
			throw new Error('you need to specify a component from the dependencies of the current component');
		}
		const index = this.components.findIndex(i => i.name == componentName);
		if (index == -1) {
			throw new Error(`component is not found: ${componentName}`);
		}

		return {
			name: this.component.name,
			version: {
				major: this.component.version.major,
				minor: this.component.version.minor
			},
			api: this.apis[index]
		};
	}
}
