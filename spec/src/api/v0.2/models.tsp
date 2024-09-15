using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

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

model SignupBody {
  name: string;
  password?: string;
  displayName: string;
}

model SigninBody {
  name: string;
  password?: string;
}

model AuthResult {
  accessToken: Token;
  refreshToken: Token;
  user: User;
}
