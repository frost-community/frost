using TypeSpec.Http;
using TypeSpec.Rest;

namespace Frost.Api.v1;

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
  createChatRoom(@body chatRoom: NewChatRoom): ChatRoom;

  @delete
  deleteChatRoom(@path chatRoomId: string): void;
}

@route("/chatrooms/{chatRoomId}/members")
interface ChatRoomMembers {
  @post
  createChatRoomMember(@path chatRoomId: string, @path userId: string): ChatRoomMember;

  @get
  listChatRoomMember(@path chatRoomId: string): ChatRoomMember[];

  @delete
  deleteChatRoomMember(@path chatRoomId: string, @path userId: string): void;
}

@route("/chatrooms/{chatRoomId}/posts")
interface ChatRoomPosts {
  @post
  createChatRoomPost(@path chatRoomId: string, @body post: NewChatRoomPost): ChatRoomPost;

  @get
  getChatRoomPost(@path chatRoomId: string, @path postId: string): ChatRoomPost;

  @delete
  deleteChatRoomPost(@path chatRoomId: string, @path postId: string): void;
}
