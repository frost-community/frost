using TypeSpec.Http;
using TypeSpec.Rest;

namespace Frost.Api.v1;

@route("/echo")
interface Echo {
  @get
  echoGet(@query query: {}): {};

  @post
  echoPost(@body body: {}): {};
}
