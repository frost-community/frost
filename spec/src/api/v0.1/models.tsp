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
}

model ChatRoomMember {
  userId: string;
  chatRoomId: string;
}

model UserId {
  @path
  @segment("user")
  userId: string;
}

model LeafId {
  @path
  @segment("leaf")
  leafId: string;
}
