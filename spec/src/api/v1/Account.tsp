using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model SignupBody {
  name: string;
  password?: string;
}

model SigninBody {
  name: string;
  password?: string;
}

model AuthResult {
  accessToken: string;
  account: Account;
}

@tag("Account")
@route("/account")
interface AccountApi {
  @operationId("GetAccount")
  @get
  getAccount(@query accountId?: string, @query name?: string): Account;

  @operationId("DeleteMyAccount")
  @route("/me")
  @delete
  deleteMyAccount(): void;

  @operationId("Signup")
  @route("/signup")
  @post
  signup(@body body: SignupBody): AuthResult;

  @operationId("Signin")
  @route("/signin")
  @post
  signin(@body body: SigninBody): AuthResult;
}
