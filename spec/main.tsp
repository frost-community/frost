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

  model NewAccount {
    name: string;
    password: string;
  }

  model Account {
    accountId: string;
    name: string;
    passwordAuthEnabled: boolean;
    users: User[];
  }

  @route("/accounts")
  interface Accounts {
    @post
    register(body: NewAccount): Account;
  }

  @route("/me")
  interface Me {
    @get
    get(): Account;
  }

  model NewUser {
    name: string;
    displayName: string;
  }

  model User {
    userId: string;
    name: string;
    displayName: string;
  }

  @route("/users")
  interface Users {
    @post
    create(body: NewUser): User;

    @get
    get(@path id: string): User;

    @delete
    delete(@path id: string): void;
  }

  // Post, Timeline, ChatRoom

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
    create(body: NewTimelinePost): TimelinePost;

    @get
    get(@path id: string): TimelinePost;

    @delete
    delete(@path id: string): void;
  }

  model NewChatRoom {
    title: string;
  }

  model ChatRoom {
    chatRoomId: string;
    title: string;
  }

  @route("/chatrooms")
  interface ChatRooms {
    @post
    create(body: NewChatRoom): ChatRoom;

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

  model ChatRoomPost {
    postId: string;
    chatRoomId: string;
    userId: string;
    content: string;
  }

  model NewChatRoomPost {
    content: string;
  }

  @route("/chatrooms/{chatRoomId}/posts")
  interface ChatRoomPosts {
    @post
    create(@path chatRoomId: string, body: NewChatRoomPost): ChatRoomPost;

    @get
    get(@path chatRoomId: string, @path postId: string): ChatRoomPost;

    @delete
    delete(@path chatRoomId: string, @path postId: string): void;
  }
}
