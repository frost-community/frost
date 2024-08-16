using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model NewTimelinePost {
  content: string;
}

@route("/post")
interface Posts {
  @tag("Timeline")
  @operationId("CreateTimelinePost")
  @post
  createTimelinePost(@body post: NewTimelinePost): Post;

  @tag("Timeline")
  @tag("ChatRoom")
  @operationId("GetPost")
  @get
  getPost(@query postId: string): Post;


  @tag("Timeline")
  @tag("ChatRoom")
  @operationId("DeletePost")
  @delete
  deletePost(@query postId: string): void;
}
