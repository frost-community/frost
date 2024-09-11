import { post } from "@prisma/client";
import * as sql from "@prisma/client/sql";
import { Container } from "inversify";
import { TYPES } from "../container/types";
import { AccessContext } from "../modules/AccessContext";
import { DB } from "../modules/db";
import { PostEntity } from "../modules/entities";

/**
 * 投稿を作成する
*/
export async function create(
  params: { chatRoomId?: string, userId: string, content: string },
  ctx: AccessContext,
  container: Container,
): Promise<PostEntity> {
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
  params: { postId: string },
  ctx: AccessContext,
  container: Container,
): Promise<PostEntity | undefined> {
  const db = container.get<DB>(TYPES.db);
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

export async function fetchTimeline(
  params: { kind: string, prevCursor?: string, nextCursor?: string, limit?: number },
  ctx: AccessContext,
  container: Container,
): Promise<PostEntity[]> {
  const db = container.get<DB>(TYPES.db);
  const limit = params.limit ?? 50;
  if (params.nextCursor != null) {
    const rows = await db.$queryRawTyped(sql.fetchHomeTimelineNextCursor(ctx.userId, params.nextCursor, limit));
    rows.reverse();
    return rows.map(x => mapEntity(x));
  } else if (params.prevCursor != null) {
    const rows = await db.$queryRawTyped(sql.fetchHomeTimelinePrevCursor(ctx.userId, params.prevCursor, limit));
    return rows.map(x => mapEntity(x));
  } else {
    const rows = await db.$queryRawTyped(sql.fetchHomeTimelineLatest(ctx.userId, limit));
    return rows.map(x => mapEntity(x));
  }
}

/**
 * 投稿を削除する
 * @returns 削除に成功したかどうか
*/
export async function remove(
  params: { postId: string },
  ctx: AccessContext,
  container: Container,
): Promise<boolean> {
  const db = container.get<DB>(TYPES.db);
  const result = await db.post.deleteMany({
    where: {
      post_id: params.postId,
    },
  });
  return (result.count > 0);
}

function mapEntity(row: post): PostEntity {
  const post: PostEntity = {
    postId: row.post_id,
    userId: row.user_id,
    content: row.content,
  };

  if (row.chat_room_id != null) {
    post.chatRoomId = row.chat_room_id;
  }

  return post;
}
