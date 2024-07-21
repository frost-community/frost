using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model NewTimelinePost {
  content: string;
}

@tag("Timeline")
@route("/timelines/posts")
interface TimelinesPosts {
  @operationId("CreateTimelinePost")
  @post
  createTimelinePost(@body post: NewTimelinePost): Post;
}
