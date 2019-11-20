import { EventEmitter } from 'events';
import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	MongoProvider,
	ConsoleMenu
} from 'frost-core';
import { SetupItem } from './showComponentSettingMenu';
import { IBootConfig } from './bootConfig';

export class InstallApi<T> implements IComponentInstallApi {
	constructor(component: IComponent, db: MongoProvider, setupItems: SetupItem[], bootConfig: IBootConfig) {
		this.cryptoKey = bootConfig.cryptoKey;
		this.db = db;
		this.component = component;
		this.setupItems = setupItems;
	}

	cryptoKey: string;
	db: MongoProvider;
	component: IComponent;
	setupItems: SetupItem[];

	registerSetupMenu(setupMenu: ConsoleMenu): void {
		this.setupItems.push({ component: this.component, setupMenu: setupMenu });
	}
}

export class BootApi<T> implements IComponentBootApi {
	constructor(component: IComponent, components: IComponent[], apis: any[], db: MongoProvider, messenger: EventEmitter, bootConfig: IBootConfig) {
		this.cryptoKey = bootConfig.cryptoKey;
		this.db = db;
		this.component = component;
		this.components = components;
		this.messenger = messenger;
		this.apis = apis;
	}

	cryptoKey: string;
	db: MongoProvider;
	component: IComponent;
	components: IComponent[];
	messenger: EventEmitter;
	apis: any[];

	use(componentName: string): any {
		if (this.component.dependencies.indexOf(componentName) == -1) {
			throw new Error('you need to specify a component from the dependencies of the current component');
		}
		const index = this.components.findIndex(i => i.name == componentName);
		if (index == -1) {
			throw new Error(`component is not found: ${componentName}`);
		}
		return this.apis[index];
	}
}
