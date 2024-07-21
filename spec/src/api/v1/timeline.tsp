using TypeSpec.Http;
using TypeSpec.Rest;

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
  @post
  createTimelinePost(@body post: NewTimelinePost): TimelinePost;

  @get
  getTimelinePost(@path id: string): TimelinePost;

  @delete
  deleteTimelinePost(@path id: string): void;
}
