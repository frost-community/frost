import { ComponentEngineManager, IComponent } from '@frost/component';

export interface IWebOptions {
}

export default (options?: IWebOptions): IComponent => {
	function handler(manager: ComponentEngineManager) {
		manager.http.addRoute((app) => {
			app.get('/', (req, res) => {
				res.send('frost');
			});
		});
	}

	return {
		name: 'webapp',
		handler: handler
	};
};
