import Express from 'express';
import { pathToRegexp } from 'path-to-regexp';
import $ from 'cafy';

export interface DynamicHandler<T> {
	priority?: number;
	path?: string;
	handler: T;
}

export function addHandler<T>(items: DynamicHandler<T>[], options: { priority?: number, path?: string }, ...handlers: T[]) {
	if (options.priority != null) {
		const priorityValidation = $.number.int().range(1, 3);
		if (priorityValidation.nok(options.priority)) {
			throw new Error('priority must be a integer value between from 1 to 3');
		}
	}
	for (const handler of handlers) {
		items.push({
			path: options.path,
			priority: options.priority,
			handler: handler
		});
	}
}

export function generateDynamicMiddlerware(items: DynamicHandler<Express.RequestHandler>[]): Express.RequestHandler {
	return function(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
		// sort items by priority
		const priorityTable: Record<number, DynamicHandler<Express.RequestHandler>[]> = { 1: [], 2: [], 3: [] };
		for (const item of items) {
			const priority = item.priority != null ? item.priority : 2;
			priorityTable[priority].push(item);
		}
		// dynamic handling
		function nextCallback(priority: number, index: number, err?: any): () => void {
			if (err) {
				return () => {
					setImmediate(() => next(err));
				};
			}
			if (index >= priorityTable[priority].length) {
				if (priority > 1) {
					return () => {
						setImmediate(() => {
							priorityTable[priority - 1][0].handler(req, res, (e) => nextCallback(priority - 1, 1, e)());
						});
					};
				}
				return () => {
					setImmediate(() => next());
				};
			}
			else {
				const path = priorityTable[priority][index].path;
				if (path) {
					const pathMatcher = pathToRegexp(path, [], {
						end: false
					});
					if (!pathMatcher.test(req.path)) {
						return () => {
							setImmediate(() => nextCallback(priority, index + 1)());
						};
					}
				}
				return () => {
					setImmediate(() => {
						priorityTable[priority][index].handler(req, res, (e) => nextCallback(priority, index + 1, e)());
					});
				};
			}
		}
		nextCallback(3, 0)();
	};
}

export function generateDynamicErrorMiddleware(items: DynamicHandler<Express.ErrorRequestHandler>[]): Express.ErrorRequestHandler {
	return function(err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) {
		// sort items by priority
		const priorityTable: Record<number, DynamicHandler<Express.ErrorRequestHandler>[]> = { 1: [], 2: [], 3: [] };
		for (const item of items) {
			const priority = item.priority != null ? item.priority : 2;
			priorityTable[priority].push(item);
		}
		// dynamic handling
		function nextCallback(priority: number, index: number, nextErr?: any): () => void {
			if (nextErr) {
				return () => {
					setImmediate(() => next(nextErr));
				};
			}
			if (index >= priorityTable[priority].length) {
				if (priority > 1) {
					return () => {
						setImmediate(() => {
							priorityTable[priority - 1][0].handler(err, req, res, (e) => nextCallback(priority - 1, 1, e)());
						});
					};
				}
				return () => {
					setImmediate(() => next());
				};
			}
			else {
				const path = priorityTable[priority][index].path;
				if (path) {
					const pathMatcher = pathToRegexp(path, [], {
						end: false
					});
					if (!pathMatcher.test(req.path)) {
						return () => {
							setImmediate(() => nextCallback(priority, index + 1)());
						};
					}
				}
				return () => {
					setImmediate(() => {
						priorityTable[priority][index].handler(err, req, res, (e) => nextCallback(priority, index + 1, e)());
					});
				};
			}
		}
		nextCallback(3, 0)();
	};
}
