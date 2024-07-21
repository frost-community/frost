using TypeSpec.Http;
using TypeSpec.Rest;

namespace Frost.Api.Version1;

model NewChatRoom {
  title: string;
}

model ChatRoom {
  chatRoomId: string;
  title: string;
}

model ChatRoomMember {
  userId: string;
  chatRoomId: string;
}

model ChatRoomPost {
  postId: string;
  chatRoomId: string;
  userId: string;
  content: string;
}

model NewChatRoomPost {
  content: string;
}

@route("/chatrooms")
interface ChatRooms {
  @post
  create(@body chatRoom: NewChatRoom): ChatRoom;

  @delete
  delete(@path id: string): void;
}

@route("/chatrooms/{chatRoomId}/members")
interface ChatRoomMembers {
  @post
  create(@path chatRoomId: string, @path userId: string): ChatRoomMember;

  @get
  list(@path chatRoomId: string): ChatRoomMember[];

  @delete
  delete(@path chatRoomId: string, @path userId: string): void;
}

@route("/chatrooms/{chatRoomId}/posts")
interface ChatRoomPosts {
  @post
  create(@path chatRoomId: string, @body post: NewChatRoomPost): ChatRoomPost;

  @get
  get(@path chatRoomId: string, @path postId: string): ChatRoomPost;

  @delete
  delete(@path chatRoomId: string, @path postId: string): void;
}
