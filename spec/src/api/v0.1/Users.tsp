using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

@tag("User")
interface UsersApi {
  @operationId("GetUser")
  @route("/users")
  @get
  getUser(...UserId, @query name?: string): User;

  @operationId("DeleteUser")
  @route("/users")
  @delete
  deleteUser(@query userId: string): void;
}
