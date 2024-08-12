using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model CreateUserBody {
  name: string;
  displayName: string;
}

@tag("User")
@route("/user")
interface UserApi {
  @operationId("CreateUser")
  @post
  createUser(@body user: CreateUserBody): User;

  @operationId("GetUser")
  @get
  getUser(@query userId?: string, @query name?: string): User;

  @operationId("DeleteUser")
  @delete
  deleteUser(@query userId: string): void;
}
