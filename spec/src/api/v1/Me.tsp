using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

@tag("Account")
@route("/me")
interface Me {
  @operationId("GetMe")
  @get
  getMe(): Account;
}
