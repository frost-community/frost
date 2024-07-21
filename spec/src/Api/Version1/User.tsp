using TypeSpec.Http;
using TypeSpec.Rest;

namespace Frost.Api.Version1;

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
  create(@body user: NewUser): User;

  @get
  get(@path id: string): User;

  @delete
  delete(@path id: string): void;
}
