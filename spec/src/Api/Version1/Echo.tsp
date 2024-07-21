using TypeSpec.Http;
using TypeSpec.Rest;

namespace Frost.Api.Version1;

@route("/echo")
interface Echo {
  @get
  get(@query query: {}): {};

  @post
  post(@body body: {}): {};
}
