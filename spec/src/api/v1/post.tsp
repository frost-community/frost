using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

@tag("Post")
@tag("ChatRoom")
@tag("Timeline")
@route("/posts")
interface Posts {
  @operationId("GetPost")
  @get
  getPost(@path postId: string): Post;

  @operationId("DeletePost")
  @delete
  deletePost(@path postId: string): void;
}
