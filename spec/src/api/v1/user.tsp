using TypeSpec.Http;
using TypeSpec.Rest;

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
  @post
  createUser(@body user: NewUser): User;

  @get
  getUser(@path userId: string): User;

  @delete
  deleteUser(@path userId: string): void;
}
