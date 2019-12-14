import redis from 'redis';
import { EventEmitter } from 'events';
import { promisify } from 'util';

export default class RedisEventEmitter extends EventEmitter {
	constructor(namespace: string, isReceveMode: boolean, redisOptions?: {host: string, port: number}) {
		super();
		this.namespace = namespace;
		this.isReceveMode = isReceveMode;
		this.redis = redis.createClient(redisOptions || { host: 'localhost', port: 6379 });
		this.redis.on('error', (err) => {
			throw new Error(`[RedisEventEmitter] ${String(err)}`);
		});
		if (this.isReceveMode) {
			this.redis.on('message', (namespace, json) => {
				let event;
				try {
					event = JSON.parse(json);
				}
				catch (err) {
					console.warn('recieved redis event is not json format.');
					return;
				}
				if (event.event == null || event.data == null) {
					return;
				}
				super.emit(event.event, event.data);
			});
			this.redis.subscribe(this.namespace, (err) => {
				if (err) {
					throw new Error('[RedisEventEmitter] failed to subscribe');
				}
			});
		}
	}

	namespace: string;

	private isReceveMode: boolean;

	private redis: redis.RedisClient;

	emit(): boolean {
		throw new Error('Please use send method');
	}

	async send(event: string, data: any): Promise<void> {
		if (this.isReceveMode) {
			throw new Error('emit is disable. this RedisEventEmitter is recieve mode.');
		}

		let publish = promisify(this.redis.publish);
		publish = publish.bind(this.redis);

		await publish(this.namespace, JSON.stringify({ event, data }));
	}

	async dispose(): Promise<void> {
		let quit = promisify(this.redis.quit);
		quit = quit.bind(this.redis);

		let unsubscribe = (channel: string) => new Promise<string>((resolve, reject) => {
			this.redis.unsubscribe(channel, (err, message) => {
				if (err) return reject(err);
				resolve(message);
			});
		});

		if (this.isReceveMode) {
			await unsubscribe(this.namespace);
			this.removeAllListeners();
		}
		if (this.redis.connected) {
			await quit();
		}
		this.redis.removeAllListeners();
	}
}
