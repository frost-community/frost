using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

@tag("Account")
@route("/account/me")
interface Me {
  @operationId("GetMyAccount")
  @get
  getMyAccount(): Account;

  @operationId("DeleteMyAccount")
  @delete
  deleteMyAccount(): void;
}
