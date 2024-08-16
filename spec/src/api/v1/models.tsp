using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model User {
  userId: string;
  name: string;
  displayName: string;
  passwordAuthEnabled: boolean;
}

model Post {
  postId: string;
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
