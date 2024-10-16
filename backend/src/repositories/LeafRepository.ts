import { post } from "@prisma/client";
import { Container } from "inversify";
import { TYPES } from "../container/types";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { LeafEntity } from "../modules/entities";

/**
 * 投稿を作成する
*/
export async function create(
  params: { chatRoomId?: string, userId: string, content: string },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity> {
  const db = container.get<DB>(TYPES.db);
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
  params: { leafId: string },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity | undefined> {
  const db = container.get<DB>(TYPES.db);
  const row = await db.post.findFirst({
    where: {
      post_id: params.leafId,
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
  params: { leafId: string },
  ctx: AccessContext,
  container: Container,
): Promise<boolean> {
  const db = container.get<DB>(TYPES.db);
  const result = await db.post.deleteMany({
    where: {
      post_id: params.leafId,
    },
  });
  return (result.count > 0);
}

function mapEntity(row: post): LeafEntity {
  const leaf: LeafEntity = {
    leafId: row.post_id,
    userId: row.user_id,
    content: row.content,
  };

  if (row.chat_room_id != null) {
    leaf.chatRoomId = row.chat_room_id;
  }

  return leaf;
}
