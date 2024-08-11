using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model NewAccount {
  name: string;
  password: string;
}

@tag("Account")
@route("/account")
interface Accounts {
  @operationId("CreateAccount")
  @post
  createAccount(@body account: NewAccount): Account;
}
