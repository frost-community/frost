import { ComponentApi, IComponent } from 'frost-component';
import IWebAppConfig from './modules/IWebAppConfig';
import verifyWebAppConfig from './modules/verifyWebAppConfig';

export {
	IWebAppConfig
};

export interface IWebOptions {
}

export default (config: IWebAppConfig, options?: IWebOptions): IComponent => {
	verifyWebAppConfig(config);

	function handler(componentApi: ComponentApi) {
		componentApi.http.addRoute((app) => {
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
