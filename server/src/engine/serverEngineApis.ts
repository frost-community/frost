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

export class InstallApi implements IComponentInstallApi {
	constructor(db: MongoProvider) {
		this.db = db;
	}

	db: MongoProvider;

	registerSetupMenu(setupMenu: ConsoleMenu): void {
		// TODO
	}
}

export class BootApi implements IComponentBootApi {
	constructor(component: IComponent, db: MongoProvider, messenger: EventEmitter) {
		this.component = component;
		this.db = db;
		this.messenger = messenger;
	}

	component: IComponent;
	db: MongoProvider;
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
}
