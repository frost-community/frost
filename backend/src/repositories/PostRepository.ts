import { post } from "@prisma/client";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { PostEntity } from "../modules/entities";

/**
 * 投稿を作成する
*/
export async function create(
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

/**
 * 投稿を取得する
*/
export async function get(
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
 * 投稿を削除する
 * @returns 削除に成功したかどうか
*/
export async function remove(
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
