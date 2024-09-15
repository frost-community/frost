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

model SearchUsersQueryString {}

model DeleteUserBody {}

model GetFollowingsQueryString {}

model FollowUserBody {}

model UnfollowUserBody {}

model GetHomeTimelineQueryString {}

// Leaf parameters

model CreateLeafBody {}

model GetLeafQueryString {}

model SearchLeafsQueryString {}

model DeleteLeafBody {}

// ChatRoom parameters

model CreateChatRoomBody {}

model GetChatRoomQueryString {}

model SearchChatRoomsQueryString {}

model DeleteChatRoomBody {}

model CreateChatRoomLeafBody {}

model GetChatRoomTimelineQueryString {}
