using TypeSpec.Http;
using TypeSpec.Rest;

namespace Frost.Api.Version1;

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
  create(@body post: NewTimelinePost): TimelinePost;

  @get
  get(@path id: string): TimelinePost;

  @delete
  delete(@path id: string): void;
}
