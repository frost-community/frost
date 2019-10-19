import MongoProvider from './MongoProvider';
import ConsoleMenu from './ConsoleMenu';

export type ActionResult = ActionOkResult | ActionErrorResult;

export interface ActionOkResult {
	data: {[x: string]: any};
}
export function isActionOkResult(actionResult: {[x: string]: any}): actionResult is ActionOkResult {
	return actionResult.data != undefined;
}

export interface ActionError {
	reason: string;
	details?: any;
}

export interface ActionErrorResult {
	error: ActionError;
}
export function isActionErrorResult(actionResult: {[x: string]: any}): actionResult is ActionErrorResult {
	return actionResult.error != undefined;
}


export interface IComponentInstallApi {
	db: MongoProvider;
	registerSetupMenu(setupMenu: ConsoleMenu): void;
}

export interface IComponentBootApi {
	db: MongoProvider;

	// action
	defineAction(actionName: string, handler: (data: {[x: string]: any}) => Promise<ActionResult>): void;
	callAction(componentName: string, actionName: string, data: {[x: string]: any}, options?: { timeout?: number }): Promise<ActionResult>;

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
