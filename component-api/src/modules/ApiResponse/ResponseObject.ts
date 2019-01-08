/*
	define typing of API response
*/

import { IUser, IPosting, IApp, IUserRelation } from './packingObjects';

const enum ResultType {
	message = 'message',
	user = 'user',
	users = 'users',
	posting = 'posting',
	postings = 'postings',
	app = 'app',
	apps = 'apps',
	userRelation = 'userRelation'
}

export interface IResponseObject<T> {
	resultType: ResultType;
	result: T;
}

export abstract class ResponseObject<T> implements IResponseObject<T> {
	constructor(resultType: ResultType, result: T) {
		this.resultType = resultType;
		this.result = result;
	}
	resultType: ResultType;
	result: T;
}

// message

export class MessageResponseObject extends ResponseObject<string> {
	constructor(result: string) {
		super(ResultType.message, result);
	}
}

// user

export class UserResponseObject extends ResponseObject<IUser> {
	constructor(result: IUser) {
		super(ResultType.user, result);
	}
}

export class UsersResponseObject extends ResponseObject<IUser[]> {
	constructor(result: IUser[]) {
		super(ResultType.users, result);
	}
}

// posting

export class PostingResponseObject extends ResponseObject<IPosting> {
	constructor(result: IPosting) {
		super(ResultType.posting, result);
	}
}

export class PostingsResponseObject extends ResponseObject<IPosting[]> {
	constructor(result: IPosting[]) {
		super(ResultType.postings, result);
	}
}

// app

export class AppResponseObject extends ResponseObject<IApp> {
	constructor(result: IApp) {
		super(ResultType.app, result);
	}
}

export class AppsResponseObject extends ResponseObject<IApp[]> {
	constructor(result: IApp[]) {
		super(ResultType.apps, result);
	}
}

// UserRelation

export class UserRelationResponseObject extends ResponseObject<IUserRelation> {
	constructor(result: IUserRelation) {
		super(ResultType.userRelation, result);
	}
}
