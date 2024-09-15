using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model NewChatRoom {
  title: string;
}

model NewChatRoomPost {
  content: string;
}

@tag("ChatRoom")
@route("/chatrooms")
interface ChatRooms {
  @operationId("CreateChatRoom")
  @post
  createChatRoom(@body chatRoom: NewChatRoom): ChatRoom;

  @operationId("DeleteChatRoom")
  @delete
  deleteChatRoom(@path chatRoomId: string): void;
}

@tag("ChatRoom")
@route("/chatrooms/{chatRoomId}/members")
interface ChatRoomMembers {
  @operationId("CreateChatRoomMember")
  @post
  createChatRoomMember(@path chatRoomId: string, @path userId: string): ChatRoomMember;

  @operationId("ListChatRoomMember")
  @get
  listChatRoomMember(@path chatRoomId: string): ChatRoomMember[];

  @operationId("DeleteChatRoomMember")
  @delete
  deleteChatRoomMember(@path chatRoomId: string, @path userId: string): void;
}

@tag("ChatRoom")
@route("/chatrooms/{chatRoomId}/posts")
interface ChatRoomPosts {
  @operationId("CreateChatRoomPost")
  @post
  createChatRoomPost(@path chatRoomId: string, @body post: NewChatRoomPost): Leaf;
}
