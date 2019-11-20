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
	use(componentName: string): any;
}

/**
 * interface of the frost component
*/
export default interface IComponent {
	name: string;
	dependencies: string[];
	api: any;
	install?: (ctx: IComponentInstallApi) => Promise<void>;
	boot: (ctx: IComponentBootApi) => Promise<void>;
}

export function verifyComponent(component: any): boolean {
	const verificationComponent = $.obj({
		name: $.str,
		dependencies: $.array($.str),
		api: $.any,
		install: $.nullable.optional.any.pipe(i => typeof i == 'function'),
		boot: $.any.pipe(i => typeof i == 'function')
	});
	return verificationComponent.ok(component);
}
