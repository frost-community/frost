// library

export interface IRequestDriver {
  request(method: string, url: string, body?: Record<string, any>): Promise<any>;
}

export class FetchRequestDriver implements IRequestDriver {
  constructor(private fetch: (
    input: string | URL | globalThis.Request,
    init?: RequestInit,
  ) => Promise<Response>) {}

  async request(method: string, url: string): Promise<any> {
    const res = await this.fetch(url, { method });
    return res.json();
  }
}

export class RequestDriver {
  /**
   * Get a RequestDriver of the fetch API.
  */
  static fetch = new FetchRequestDriver(globalThis.fetch);
}



// generated definitions

function makeApiUsers(requestDriver: IRequestDriver): (parameters: {}) => { post: (body: {}) => Promise<User> } {
  return (parameters: {}) => {
    const path = `/api/users`;
    return {
      post: (body: {}) => {
        return requestDriver.request('post', path, body);
      },
    };
  };
}

function makeApiUsersId(requestDriver: IRequestDriver): (parameters: { id: string }) => { get: () => Promise<User>, delete: () => Promise<void> } {
  return (parameters: { id: string }) => {
    const path = `/api/users/${parameters.id}`;
    return {
      get: () => {
        return requestDriver.request('get', path);
      },
      delete: () => {
        return requestDriver.request('delete', path);
      },
    };
  };
}

function makeApiMe(requestDriver: IRequestDriver): (parameters: {}) => { get: () => Promise<Account> } {
  return (parameters: {}) => {
    const path = `/api/me`;
    return {
      get: () => {
        return requestDriver.request('get', path);
      },
    };
  };
}

export class Routes {
  '/api/users': { params: ReturnType<typeof makeApiUsers> };
  '/api/users/:id': { params: ReturnType<typeof makeApiUsersId> };
  '/api/me': { params: ReturnType<typeof makeApiMe> };

  constructor(requestDriver: IRequestDriver) {
    this['/api/users'] = { params: makeApiUsers(requestDriver) };
    this['/api/users/:id'] = { params: makeApiUsersId(requestDriver) };
    this['/api/me'] = { params: makeApiMe(requestDriver) };
  }
}

export type User = {
  userId: string,
  name: string,
  displayName: string,
};

export type Account = {
  accountId: string,
  users: User[],
  name: string,
};



// application

async function entry() {
  const routes = new Routes(RequestDriver.fetch);

  const user = await routes["/api/users"].params({}).post({});
  console.log(user.userId);

  const user2 = await routes["/api/users/:id"].params({ id: 'abcd' }).get();
  console.log(user2.userId);

  const account = await routes["/api/me"].params({}).get();
  console.log(account.accountId);
}
entry().catch(err => console.error(err));
