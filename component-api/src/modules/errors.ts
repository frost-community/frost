export class MissingArgumentsError extends Error {
	constructor() {
		super('missing arguments');
	}
}

export class InvalidArgumentError extends Error {
	constructor(paramName: string) {
		super(`argument '${paramName}' is invalid`);
	}
}

export class InvalidOperationError extends Error {
	constructor(message: string) {
		super(message);
	}
}
