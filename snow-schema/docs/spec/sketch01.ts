// library

export interface IRequestDriver {
  request(opts: { method: string, url: string, body?: any }): Promise<any>;
}

export class FetchRequestDriver implements IRequestDriver {
  constructor(private fetch: (
    input: string | URL | globalThis.Request,
    init?: RequestInit,
  ) => Promise<Response>) {}

  async request(opts: { method: string, url: string, body?: any }): Promise<any> {
    let res;
    if (opts.body !== undefined) {
      res = await this.fetch(opts.url, { method: opts.method, body: JSON.stringify(opts.body) });
    } else {
      res = await this.fetch(opts.url, { method: opts.method });
    }
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

export type Account = {
  accountId: string,
  name: string,
  users: User[],
};

export type User = {
  userId: string,
  name: string,
  displayName: string,
};

export function Client(baseUrl: string, requestDriver: IRequestDriver) {
  function url(path: string): string {
    return new URL(path, baseUrl).toString();
  }
  return {
    '/api/me': {
      get: (): Promise<Account> =>
        requestDriver.request({ method: 'get', url: url(`/api/me`) }),
    },
    '/api/users': {
      post: (body: {}): Promise<User> =>
        requestDriver.request({ method: 'post', url: url(`/api/users`), body }),
    },
    '/api/users/:id': {
      get: (param: { id: string }): Promise<User> =>
        requestDriver.request({ method: 'get', url: url(`/api/users/${param.id}`) }),
      delete: (param: { id: string }): Promise<void> =>
        requestDriver.request({ method: 'delete', url: url(`/api/users/${param.id}`) }),
    },
  };
}



// application

async function entry() {
  const client = Client('http://localhost:3000', RequestDriver.fetch);

  const user = await client["/api/users"].post({});
  console.log(user.userId);

  const user2 = await client["/api/users/:id"].get({ id: user.userId });
  console.log(user2.userId);

  await client["/api/users/:id"].delete({ id: user.userId });

  const account = await client["/api/me"].get();
  console.log(account.accountId);
}
entry().catch(err => console.error(err));
