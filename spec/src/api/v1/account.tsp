using TypeSpec.Http;
using TypeSpec.Rest;

namespace Frost.Api.v1;

model NewAccount {
  name: string;
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
  registerAccount(@body account: NewAccount): Account;
}

@route("/me")
interface Me {
  @get
  getMe(): Account;
}
