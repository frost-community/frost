import MongoProvider from './MongoProvider';
import ConsoleMenu from './ConsoleMenu';

export interface IComponentInstallApi {
	db: MongoProvider;
	registerSetupMenu(setupMenu: ConsoleMenu): void;
}

export interface IComponentBootApi {
	db: MongoProvider;

	// action
	defineAction(actionName: string, handler: (param: {[x: string]: any}) => Promise<{[x: string]: any}>): void;
	callAction(actionName: string, param: {[x: string]: any}): Promise<{[x: string]: any}>;

	// event
	emitEvent(componentName: string, eventType: string, eventData: {[x: string]: any}): void;
	addEventListener(eventType: string, callback: (eventData: {[x: string]: any}) => void): void;
	removeEventListener(eventType: string, callback: (eventData: {[x: string]: any}) => void): void;
	removeAllEventListeners(eventType?: string): void;
}

/**
 * interface of the frost component
*/
export default interface IComponent {
	name: string;
	install?: (installArg: IComponentInstallApi) => Promise<void>;
	boot: (bootArg: IComponentBootApi) => Promise<void>;
}
