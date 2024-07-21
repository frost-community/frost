using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model NewUser {
  name: string;
  displayName: string;
}

model User {
  userId: string;
  name: string;
  displayName: string;
}

@route("/users")
interface Users {
  @operationId("createUser")
  @post
  createUser(@body user: NewUser): User;

  @operationId("getUser")
  @get
  getUser(@path userId: string): User;

  @operationId("deleteUser")
  @delete
  deleteUser(@path userId: string): void;
}
