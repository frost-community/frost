export interface IError {
	error: { reason: string };
}
export function isError(obj: any): obj is IError {
	return obj.error != null;
}

export async function callApi(path: string, params?: Record<string, any>) {
	const resRaw = await fetch(path, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(params || { })
	});
	const res = await resRaw.json();
	return res;
}
