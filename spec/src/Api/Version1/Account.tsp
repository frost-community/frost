using TypeSpec.Http;
using TypeSpec.Rest;

namespace Frost.Api.Version1;

model NewAccount {
  name1: string;
  password: string;
}

model Account {
  accountId: string;
  name: string;
  passwordAuthEnabled: boolean;
  users: User[];
}

@route("/accounts")
interface Accounts {
  @post
  register(@body account: NewAccount): Account;
}

@route("/me")
interface Me {
  @get
  get(): Account;
}
