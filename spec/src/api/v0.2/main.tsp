import "./models.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

@route("/api/v1")
namespace Frost.Api.v1;

@route("/auth")
@tag("Auth")
interface AuthApi {
  @route("/signup")
  @post signup(@body body: SignupBody): AuthResult;

  @route("/signin")
  @post signin(@body body: SigninBody): AuthResult;
}

@route("/user")
interface UserApi {
  @route("/getUser")
  @get getUser(): User;

  @route("/searchUsers")
  @get searchUsers(): User[];

  @route("/deleteUser")
  @post deleteUser(): void;

  @route("/getFollowings")
  @get getFollowings(): User[];

  @route("/followUser")
  @post followUser(): void;

  @route("/unfollowUser")
  @post unfollowUser(): void;

  @route("/getHomeTimeline")
  @get getHomeTimeline(): User[];
}

@route("/leaf")
interface LeafApi {
  @route("/createLeaf")
  @post createLeaf(): Leaf;

  @route("/getLeaf")
  @get getLeaf(): Leaf;

  @route("/searchLeafs")
  @get searchLeafs(): Leaf[];

  @route("/deleteLeaf")
  @post deleteLeaf(): void;
}

@route("/chatRoom")
interface ChatRoomApi {
  @route("/createChatRoom")
  @post createChatRoom(): ChatRoom;

  @route("/getChatRoom")
  @get getChatRoom(): ChatRoom;

  @route("/searchChatRooms")
  @get searchChatRooms(): ChatRoom[];

  @route("/deleteChatRoom")
  @post deleteChatRoom(): void;

  @route("/createLeaf")
  @post createLeaf(): Leaf;

  @route("/getTimeline")
  @get getTimeline(): Leaf[];
}
