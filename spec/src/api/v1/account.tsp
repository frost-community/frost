using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

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
  @operationId("registerAccount")
  @post
  registerAccount(@body account: NewAccount): Account;
}

@route("/me")
interface Me {
  @operationId("getMe")
  @get
  getMe(): Account;
}
