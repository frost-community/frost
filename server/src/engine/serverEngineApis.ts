import { EventEmitter } from 'events';
import randomstring from 'randomstring';
import {
	IComponent,
	IComponentInstallApi,
	IComponentBootApi,
	ActionResult,
	isActionOkResult,
	MongoProvider,
	ConsoleMenu
} from 'frost-core';
import {
	ActionCallFrame,
	ActionResultFrame,
	ActionErrorResultFrame
} from './actionInterface';
import { SetupItem } from './showComponentSettingMenu';
import { IBootConfig } from './bootConfig';

export class InstallApi implements IComponentInstallApi {
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

export class BootApi implements IComponentBootApi {
	constructor(component: IComponent, components: IComponent[] , db: MongoProvider, messenger: EventEmitter, bootConfig: IBootConfig) {
		this.cryptoKey = bootConfig.cryptoKey;
		this.db = db;
		this.component = component;
		this.components = components;
		this.messenger = messenger;
	}

	cryptoKey: string;
	db: MongoProvider;
	component: IComponent;
	components: IComponent[];
	messenger: EventEmitter;

	private buildActionChannelName(actionType: 'request' | 'response', actionName: string, componentName: string): string {
		return `action.${actionType}.${componentName}.${actionName}`;
	}

	private buildEventChannelName(eventType: string): string
	private buildEventChannelName(eventType: string, componentName: string): string
	private buildEventChannelName(eventType: string, componentName?: string): string {
		if (componentName) {
			return `event.${componentName}.${eventType}`;
		}
		else {
			return `event.${this.component.name}.${eventType}`;
		}
	}

	// action
	defineAction(actionName: string, handler: (data: {[x: string]: any}) => Promise<ActionResult>): void {
		this.messenger.addListener(this.buildActionChannelName('request', actionName, this.component.name), (callFrame: ActionCallFrame) => {
			const responseChannelName = this.buildActionChannelName('response', actionName, this.component.name);
			handler(callFrame.data)
			.then(result => {
				const responseFrame: ActionResultFrame = { id: callFrame.id, ...result };
				this.messenger.emit(responseChannelName, responseFrame);
			})
			.catch((err) => {
				const errorReponseFrame: ActionErrorResultFrame = { id: callFrame.id, error: { reason: 'internal_error', details: err } };
				this.messenger.emit(responseChannelName, errorReponseFrame);
			});
		});
	}
	callAction(componentName: string, actionName: string, data: {[x: string]: any}, options?: { timeout?: number }): Promise<ActionResult> {
		return new Promise((resolve, reject) => {
			options = options || {};
			options.timeout = options.timeout || 5000;

			const id: string = randomstring.generate({ length: 32 });
			let timeoutHandle: NodeJS.Timeout | undefined;
			const requestChannelName: string = this.buildActionChannelName('request', actionName, componentName);
			const responseChannelName: string = this.buildActionChannelName('response', actionName, componentName);

			// response handler
			const responseHandler = (frame: ActionResultFrame) => {
				if (frame.id != id) {
					return;
				}

				// disable response timeout
				if (timeoutHandle) {
					clearTimeout(timeoutHandle);
				}

				this.messenger.removeListener(responseChannelName, responseHandler);
				if (isActionOkResult(frame)) {
					resolve({ data: frame.data });
				}
				else {
					resolve({ error: frame.error });
				}

			}
			this.messenger.addListener(responseChannelName, responseHandler);

			// enable response timeout
			timeoutHandle = setTimeout(() => {
				this.messenger.removeListener(responseChannelName, responseHandler);
				reject(new Error('action_timeout'));
			}, options.timeout);

			// send action
			const requestFrame: ActionCallFrame = { id, data };
			this.messenger.emit(requestChannelName, requestFrame);
		});
	}

	// event
	emitEvent(componentName: string, eventType: string, eventData: {[x: string]: any}): void {
		this.messenger.emit(this.buildEventChannelName(eventType, componentName), eventData);
	}
	addEventListener(eventType: string, callback: (eventData: {[x: string]: any}) => void): void {
		this.messenger.addListener(this.buildEventChannelName(eventType), callback);
	}
	removeEventListener(eventType: string, callback: (eventData: {[x: string]: any}) => void): void {
		this.messenger.removeListener(this.buildEventChannelName(eventType), callback);
	}
	removeAllEventListeners(eventType: string): void {
		this.messenger.removeAllListeners(this.buildEventChannelName(eventType));
	}

	use(componentName: string): any {
		if (this.component.dependencies.indexOf(componentName) == -1) {
			throw new Error('you need to specify a component from the dependencies of the current component');
		}
		const targetComponent = this.components.find(i => i.name == componentName);
		if (!targetComponent) {
			throw new Error(`component is not found: ${componentName}`);
		}
		return targetComponent.api;
	}
}
