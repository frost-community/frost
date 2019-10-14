import MongoProvider from './MongoProvider';
import ConsoleMenu from './ConsoleMenu';

export interface IComponentInstallApi {
	db: MongoProvider;
	registerSetupMenu(setupMenu: ConsoleMenu): void;
}

export interface IComponentBootApi {
	db: MongoProvider;
	callApi(apiName: string, param: {[x: string]: any}): Promise<{[x: string]: any}>;
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
	boot: (componentApi: IComponentBootApi) => Promise<void>;
}
