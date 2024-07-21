import "./account.tsp";
import "./chat-room.tsp";
import "./echo.tsp";
import "./models.tsp";
import "./post.tsp";
import "./timeline.tsp";
import "./user.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

@route("/api/v1")
namespace Frost.Api.v1;
