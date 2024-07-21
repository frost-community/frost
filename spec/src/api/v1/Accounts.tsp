using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model NewAccount {
  name: string;
  password: string;
}

@tag("Account")
@route("/accounts")
interface Accounts {
  @operationId("RegisterAccount")
  @post
  registerAccount(@body account: NewAccount): Account;
}
