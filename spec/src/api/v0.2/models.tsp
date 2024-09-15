using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

// models

model AuthInfo {
  accessToken: Token;
  refreshToken: Token;
  user: User;
}

model User {
  userId: string;
  name: string;
  displayName: string;
  passwordAuthEnabled: boolean;
}

model Token {
  token: string;
  scopes: string[];
}

model Leaf {
  leafId: string;
  chatRoomId?: string;
  userId: string;
  content: string;
}

model ChatRoom {
  chatRoomId: string;
  title: string;
  description: string;
}

// Auth parameters

model SignupBody {
  name: string;
  password?: string;
  displayName: string;
}

model SigninBody {
  name: string;
  password?: string;
}

// User parameters

model GetUserQueryString {
  @query userId?: string;
  @query username?: string;
}

model SearchUsersQueryString {
  @query nextCursor?: string;
  @query prevCursor?: string;
}

model DeleteUserBody {
  userId: string;
}

model GetFollowingsQueryString {
  @query userId: string;
  @query nextCursor?: string;
  @query prevCursor?: string;
}

model FollowUserBody {
  userId: string;
}

model UnfollowUserBody {
  userId: string;
}

model GetHomeTimelineQueryString {
  @query nextCursor?: string;
  @query prevCursor?: string;
}

// Leaf parameters

model CreateLeafBody {
  content: string;
}

model GetLeafQueryString {
  @query leafId: string;
}

model SearchLeafsQueryString {
  @query nextCursor?: string;
  @query prevCursor?: string;
}

model DeleteLeafBody {
  leafId: string;
}

// ChatRoom parameters

model CreateChatRoomBody {
  title: string;
  description: string;
}

model GetChatRoomQueryString {
  @query chatRoomId: string;
}

model SearchChatRoomsQueryString {
  @query nextCursor?: string;
  @query prevCursor?: string;
}

model DeleteChatRoomBody {
  chatRoomId: string;
}

model CreateChatRoomLeafBody {
  chatRoomId: string;
  content: string;
}

model GetChatRoomTimelineQueryString {
  @query nextCursor?: string;
  @query prevCursor?: string;
}
