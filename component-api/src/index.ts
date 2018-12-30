import { promisify } from 'util'
import path from 'path';
import glob from 'glob';
import { ComponentEngineManager, IComponent } from '@frost/component';
import { IEndpoint, ApiErrorSources, registerEndpoint } from './modules/Endpoint';
import { ApiResponseManager } from './modules/ApiResponse';

export interface IApiOptions {
}

export default (options?: IApiOptions): IComponent => {
	async function handler(manager: ComponentEngineManager) {
		// get file paths of endpoint
		const endpointPaths = await promisify(glob)('**/*.js', {
			cwd: path.resolve(__dirname, 'endpoints')
		});

		for (let endpointPath of endpointPaths) {
			endpointPath = endpointPath.replace('.js', '');
			const endpoint: IEndpoint = require(`./endpoints/${endpointPath}`).default;
			registerEndpoint(endpoint, endpointPath, manager);
		}

		manager.http.addRoute((app) => {
			app.use('/api', (req, res) => {
				const apiRes = new ApiResponseManager();
				apiRes.error(ApiErrorSources.EndpointNotFound);
				apiRes.respond(res);
			});
		});
	}

	return {
		name: 'api',
		handler: handler
	};
};
