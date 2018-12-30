import Xev from 'xev';
import { EventEmitter } from 'events';

interface IPubSub {
	subscribe(channelName: string): void;
	unsubscribe(channelName: string): void;
	publish(channelName: string, message: any): void;
	addListener(handler: (message: any) => void): void
	removeListener(handler: (message: any) => void): void;
	removeAllListener(): void;
	dispose(): void;
}

export default class XevPubSub implements IPubSub {
	constructor(namespace: string) {
		this.emitter = new EventEmitter();
		this.parentEmitter = new Xev(namespace);
		this.list = {};
		this.handler = (channel) => (message) => this.emitter.emit('message', channel, message);
	}

	private emitter: EventEmitter;

	private parentEmitter: Xev;

	private list: { [x: string]: ((message: any) => void) | null };

	private handler: (channel: string) => (message: any) => void;

	subscribe(channelName: string): void {
		if (this.list[channelName] == null) {
			const handler = this.handler(channelName);
			this.parentEmitter.on(channelName, handler);
			this.list[channelName] = handler;
		}
	}

	unsubscribe(channelName: string): void {
		const handler = this.list[channelName];
		if (handler != null) {
			this.parentEmitter.removeListener(channelName, handler);
			this.list[channelName] = null;
		}
	}

	publish(channelName: string, message: any): void {
		this.parentEmitter.emit(channelName, message);
	}

	addListener(handler: (message: any) => void): void {
		this.emitter.addListener('message', handler);
	}

	removeListener(handler: (message: any) => void): void {
		this.emitter.removeListener('message', handler);
	}

	removeAllListener(): void {
		this.emitter.removeAllListeners('message');
	}

	dispose(): void {
		for (const channel of Object.keys(this.list)) {
			this.unsubscribe(channel);
		}
		this.parentEmitter.dispose();
	}
}
