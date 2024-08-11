using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model NewUser {
  name: string;
  displayName: string;
}

@tag("User")
@route("/user")
interface Users {
  @operationId("CreateUser")
  @post
  createUser(@body user: NewUser): User;

  @operationId("GetUser")
  @get
  getUser(@query userId?: string, @query name?: string): User;

  @operationId("DeleteUser")
  @delete
  deleteUser(@query userId: string): void;
}
