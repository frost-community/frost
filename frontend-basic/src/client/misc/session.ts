import { IUser } from 'frost-component-base/built/server/api/response/packingObjects';

export interface ISession {
	user: IUser;
	scopes: string[];
	accessToken: string;
}
export function isSession(obj: any): obj is ISession {
	return obj.user != null && obj.scopes != null && obj.accessToken != null;
}
