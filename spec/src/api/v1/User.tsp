using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model SignupBody {
  name: string;
  password?: string;
  displayName: string;
}

model SigninBody {
  name: string;
  password?: string;
}

model Token {
  token: string;
  scopes: string[];
}

model AuthResult {
  accessToken: Token;
  refreshToken: Token;
  user: User;
}

model CreateUserBody {
  name: string;
  displayName: string;
}

@tag("User")
interface UserApi {
  @tag("Auth")
  @operationId("Signup")
  @route("/signup")
  @post
  signup(@body body: SignupBody): AuthResult;

  @tag("Auth")
  @operationId("Signin")
  @route("/signin")
  @post
  signin(@body body: SigninBody): AuthResult;  

  @operationId("GetUser")
  @route("/user")
  @get
  getUser(@query userId?: string, @query name?: string): User;

  @operationId("DeleteUser")
  @route("/user")
  @delete
  deleteUser(@query userId: string): void;
}
