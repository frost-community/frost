export class HttpError extends Error {
	constructor(status: number, data: any) {
		super('http error');
		this.status = status;
		this.data = data;
	}
	status: number;
	data: any;
}
