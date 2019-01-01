import { IUser, IPosting, IApp, IUserRelation } from './entity';

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

export class ResponseObjectBase<T> implements IResponseObject<T> {
	constructor(resultType: ResultType, result: T) {
		this.resultType = resultType;
		this.result = result;
	}
	resultType: ResultType;
	result: T;
}

// message

export class MessageObject extends ResponseObjectBase<string> {
	constructor(result: string) {
		super(ResultType.message, result);
	}
}

// user

export class UserObject extends ResponseObjectBase<IUser> {
	constructor(result: IUser) {
		super(ResultType.user, result);
	}
}

export class UsersObject extends ResponseObjectBase<IUser[]> {
	constructor(result: IUser[]) {
		super(ResultType.users, result);
	}
}

// posting

export class PostingObject extends ResponseObjectBase<IPosting> {
	constructor(result: IPosting) {
		super(ResultType.posting, result);
	}
}

export class PostingsObject extends ResponseObjectBase<IPosting[]> {
	constructor(result: IPosting[]) {
		super(ResultType.postings, result);
	}
}

// app

export class AppObject extends ResponseObjectBase<IApp> {
	constructor(result: IApp) {
		super(ResultType.app, result);
	}
}

export class AppsObject extends ResponseObjectBase<IApp[]> {
	constructor(result: IApp[]) {
		super(ResultType.apps, result);
	}
}

// UserRelation

export class UserRelationObject extends ResponseObjectBase<IUserRelation> {
	constructor(result: IUserRelation) {
		super(ResultType.userRelation, result);
	}
}
