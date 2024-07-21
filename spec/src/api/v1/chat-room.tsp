using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

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
  @operationId("createChatRoom")
  @post
  createChatRoom(@body chatRoom: NewChatRoom): ChatRoom;

  @operationId("deleteChatRoom")
  @delete
  deleteChatRoom(@path chatRoomId: string): void;
}

@route("/chatrooms/{chatRoomId}/members")
interface ChatRoomMembers {
  @operationId("createChatRoomMember")
  @post
  createChatRoomMember(@path chatRoomId: string, @path userId: string): ChatRoomMember;

  @operationId("listChatRoomMember")
  @get
  listChatRoomMember(@path chatRoomId: string): ChatRoomMember[];

  @operationId("deleteChatRoomMember")
  @delete
  deleteChatRoomMember(@path chatRoomId: string, @path userId: string): void;
}

@route("/chatrooms/{chatRoomId}/posts")
interface ChatRoomPosts {
  @operationId("createChatRoomPost")
  @post
  createChatRoomPost(@path chatRoomId: string, @body post: NewChatRoomPost): ChatRoomPost;

  @operationId("getChatRoomPost")
  @get
  getChatRoomPost(@path chatRoomId: string, @path postId: string): ChatRoomPost;

  @operationId("deleteChatRoomPost")
  @delete
  deleteChatRoomPost(@path chatRoomId: string, @path postId: string): void;
}
