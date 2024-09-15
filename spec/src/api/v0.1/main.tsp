import "./models.tsp";
import "./Echo.tsp";
import "./Users.tsp";
import "./Leaf.tsp";
import "./ChatRooms.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

@route("/api/v1")
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

model AuthResult {
  accessToken: Token;
  refreshToken: Token;
  user: User;
}

interface RootApi {
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
}
