import { ActiveConfigManager, IComponentBootApi } from 'frost-core';
import glob from 'glob';
import path from 'path';
import { promisify } from 'util';
import { BaseApi } from '../../baseApi';
import buildHttpResResolver from './response/buildHttpResResolver';
import ApiResponseManager from './response/responseManager';
import { ApiErrorSources, IEndpoint, registerEndpoint } from './endpoints';
import accessTokenStrategy from './misc/accessTokenStrategy';

export default async function(ctx: IComponentBootApi, bootApi: BaseApi, activeConfigManager: ActiveConfigManager) {
	// passport strategy of AccessToken
	accessTokenStrategy(ctx.db);

	const endpointPaths = await promisify(glob)('**/*.js', {
		cwd: path.resolve(__dirname, './endpoints')
	});

	for (let endpointPath of endpointPaths) {
		endpointPath = endpointPath.replace('.js', '');
		const endpoint: IEndpoint = require(`./endpoints/${endpointPath}`).default;
		registerEndpoint(endpoint, endpointPath, [], bootApi, ctx.db, activeConfigManager);
	}

	// endpoint not found
	bootApi.http.postprocess({ path: '/api' }, async (req, res) => {
		const apiRes = new ApiResponseManager(buildHttpResResolver(res));
		await apiRes.error(ApiErrorSources.endpointNotFound);
	});

	// api error handling
	bootApi.http.error({ path: '/api' }, (err, req, res, next) => {
		const apiRes = new ApiResponseManager(buildHttpResResolver(res));

		// authentication error
		if (err.name == 'AuthenticationError') {
			apiRes.error(ApiErrorSources.nonAuthorized);
			return;
		}

		// json parsing error
		if (err instanceof SyntaxError && err.message.indexOf('JSON') != -1) {
			apiRes.error(ApiErrorSources.invalidJson);
			return;
		}

		// server error
		console.error('Server error:');
		console.error(err);
		apiRes.error(ApiErrorSources.serverError);
	});
}
