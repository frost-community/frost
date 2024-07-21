import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service({
  title: "Frost",
  version: "0.1.0"
})
@server("http://localhost:3000", "local server")
namespace Frost;

@route("/api/v1")
namespace ApiVersion1 {
  // Account, User

  model Account {
    accountId: string;
    name: string;
    users: User[];
  }

  @route("/me")
  interface Me {
    @get
    get(): Account;
  }

  model User {
    userId: string;
    name: string;
    displayName: string;
  }

  @route("/users")
  interface Users {
    @post
    create(): User;

    @get
    get(@path id: string): User;

    @delete
    delete(@path id: string): void;
  }

  // Post, Timeline, ChatRoom

  model Post {
    postId: string;
  }

  @route("/timelines/posts")
  interface TimelinePosts {
    @post
    create(): Post;

    @get
    get(@path id: string): Post;

    @delete
    delete(@path id: string): void;
  }

  model ChatRoom {
    chatRoomId: string;
  }

  @route("/chatrooms")
  interface ChatRooms {
    @post
    create(): ChatRoom;

    @delete
    delete(@path id: string): void;
  }

  model ChatRoomMember {
    userId: string;
    chatRoomId: string;
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
    create(@path chatRoomId: string): Post;

    @get
    get(@path chatRoomId: string, @path postId: string): Post;

    @delete
    delete(@path chatRoomId: string, @path postId: string): void;
  }
}
