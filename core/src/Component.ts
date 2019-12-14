import { EventEmitter } from 'events';
import $ from 'cafy';
import MongoProvider from './MongoProvider';
import ConsoleMenu from './ConsoleMenu';

export interface IComponentInstallApi {
	cryptoKey: string;
	db: MongoProvider;
	registerSetupMenu(setupMenu: ConsoleMenu): void;
}

export interface IComponentBootApi {
	cryptoKey: string;
	db: MongoProvider;
	messenger: EventEmitter;
	use(componentName: string): any;
}

/**
 * interface of the frost component
*/
export default interface IComponent {
	name: string;
	version: { major: number, minor: number };
	dependencies: string[];
	install?: (ctx: IComponentInstallApi) => Promise<void>;
	boot: (ctx: IComponentBootApi) => Promise<any>;
}

export function verifyComponent(component: any): boolean {
	const verificationComponent = $.obj({
		name: $.str,
		version: $.object({
			major: $.number.int().range(0, 9999),
			minor: $.number.int().range(0, 9999)
		}),
		dependencies: $.array($.str),
		install: $.nullable.optional.any.pipe(i => typeof i == 'function'),
		boot: $.any.pipe(i => typeof i == 'function')
	});
	return verificationComponent.ok(component);
}
