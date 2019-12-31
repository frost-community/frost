import Express from 'express';
import { IBaseApi } from 'frost-component-base';
import { IComponent, IComponentBootApi } from 'frost-core';
import path from 'path';

class FrontendComponent implements IComponent {
	name: string = 'frontend-basic';
	version = { major: 1, minor: 0 };
	dependencies: string[] = ['base'];

	async boot(ctx: IComponentBootApi): Promise<void> {
		const base: IBaseApi = ctx.use('base');
		// deliver pages
		base.http.preprocess({ }, Express.static(path.resolve(__dirname, './client')));
	}
}

export default () => new FrontendComponent();
