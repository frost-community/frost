using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

@route("/echo")
interface Echo {
  @operationId("echoGet")
  @get
  echoGet(@query query: {}): {};

  @operationId("echoPost")
  @post
  echoPost(@body body: {}): {};
}
