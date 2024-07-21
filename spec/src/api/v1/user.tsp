using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model NewUser {
  name: string;
  displayName: string;
}

@tag("User")
@route("/users")
interface Users {
  @operationId("CreateUser")
  @post
  createUser(@body user: NewUser): User;

  @operationId("GetUser")
  @get
  getUser(@path userId: string): User;

  @operationId("DeleteUser")
  @delete
  deleteUser(@path userId: string): void;
}
