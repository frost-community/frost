using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model TimelinePost {
  postId: string;
  userId: string;
  content: string;
}

model NewTimelinePost {
  content: string;
}

@route("/timelines/posts")
interface TimelinePosts {
  @operationId("createTimelinePost")
  @post
  createTimelinePost(@body post: NewTimelinePost): TimelinePost;

  @operationId("getTimelinePost")
  @get
  getTimelinePost(@path postId: string): TimelinePost;

  @operationId("deleteTimelinePost")
  @delete
  deleteTimelinePost(@path postId: string): void;
}
