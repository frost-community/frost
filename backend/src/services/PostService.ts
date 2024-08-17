import { eq } from "drizzle-orm";
import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { postTable } from "../database/schema";
import { appError, PostNotFound } from "../modules/apiErrors";
import { PostEntity } from "../types/entities";
import { AccessContext } from "../types/access-context";

@injectable()
export class PostService {
  constructor(
  ) {}

  async create(params: { chatRoomId?: string, content: string }, ctx: AccessContext): Promise<PostEntity> {
    const rows = await ctx.db.getCurrent()
      .insert(
        postTable
      )
      .values({
        chatRoomId: params.chatRoomId,
        userId: ctx.userId,
        content: params.content,
      })
      .returning();
    const row = rows[0]!;

    const post = {
      postId: row.postId,
      chatRoomId: row.chatRoomId ?? undefined,
      userId: row.userId,
      content: row.content,
    };
    return post;
  }

  async get(params: { postId: string }, ctx: AccessContext): Promise<PostEntity> {
    const rows = await ctx.db.getCurrent()
      .select({
        postId: postTable.postId,
        chatRoomId: postTable.chatRoomId,
        userId: postTable.userId,
        content: postTable.content,
      })
      .from(
        postTable
      )
      .where(
        eq(postTable.postId, params.postId)
      );

    if (rows.length == 0) {
      throw appError(new PostNotFound({ postId: params.postId }));
    }
    const row = rows[0]!;

    const post = {
      postId: row.postId,
      chatRoomId: row.chatRoomId ?? undefined,
      userId: row.userId,
      content: row.content,
    };
    return post;
  }

  async delete(params: { postId: string }, ctx: AccessContext): Promise<void> {
    const rows = await ctx.db.getCurrent()
      .delete(
        postTable
      )
      .where(
        eq(postTable.postId, params.postId)
      );

    if (rows.rowCount == 0) {
      throw appError(new PostNotFound({ postId: params.postId }));
    }
  }
}
