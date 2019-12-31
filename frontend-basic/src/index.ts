import Express from 'express';
import { IBaseApi, HttpMethod } from 'frost-component-base';
import { IComponent, IComponentBootApi } from 'frost-core';
import path from 'path';
import log from './misc/log';

class FrontendComponent implements IComponent {
	name: string = 'frontend-basic';
	version = { major: 1, minor: 0 };
	dependencies: string[] = ['base'];

	async boot(ctx: IComponentBootApi): Promise<void> {
		const base = ctx.use('base');
		const baseApi: IBaseApi = base.api;

		if (base.version.major > 1) {
			throw new Error('the specified version of the component-base is not supported. (version <= 1.x)');
		}

		log('adding routing ...');

		// deliver static resources
		baseApi.http.preprocess({ }, Express.static(path.resolve(__dirname, './client')));

		// page
		baseApi.http.route(HttpMethod.GET, '/*', (req, res) => {
			res.sendFile(path.resolve(__dirname, './client/index.html'));
		});
	}
}

export default () => new FrontendComponent();
