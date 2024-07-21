using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

@tag("Echo")
@route("/echo")
interface Echo {
  @operationId("EchoGet")
  @get
  echoGet(@query query: {}): {};

  @operationId("EchoPost")
  @post
  echoPost(@body body: {}): {};
}
