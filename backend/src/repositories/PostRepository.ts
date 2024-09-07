import { post } from "@prisma/client";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { PostEntity } from "../modules/entities";

export async function createPost(
  params: { chatRoomId?: string, userId: string, content: string },
  ctx: AccessContext,
  db: DB,
): Promise<PostEntity> {
  const row = await db.post.create({
    data: {
      chat_room_id: params.chatRoomId,
      user_id: params.userId,
      content: params.content,
    },
  });

  return mapEntity(row);
}

export async function getPost(
  params: { postId: string },
  ctx: AccessContext,
  db: DB,
): Promise<PostEntity | undefined> {
  const row = await db.post.findFirst({
    where: {
      post_id: params.postId,
    },
  });

  if (row == null) {
    return undefined;
  }

  return mapEntity(row);
}

/**
 * @returns 削除に成功したかどうか
*/
export async function deletePost(
  params: { postId: string },
  ctx: AccessContext,
  db: DB,
): Promise<boolean> {
  const result = await db.post.deleteMany({
    where: {
      post_id: params.postId,
    },
  });
  return (result.count > 0);
}

function mapEntity(row: post): PostEntity {
  return {
    postId: row.post_id,
    chatRoomId: row.chat_room_id ?? undefined,
    userId: row.user_id,
    content: row.content,
  };
}
