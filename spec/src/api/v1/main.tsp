import "./models.tsp";
import "./Accounts.tsp";
import "./ChatRooms.tsp";
import "./Echo.tsp";
import "./Me.tsp";
import "./Posts.tsp";
import "./Users.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

@route("/api/v1")
namespace Frost.Api.v1;
