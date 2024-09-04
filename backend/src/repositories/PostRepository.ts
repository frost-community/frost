import { post } from "@prisma/client";
import * as sql from "@prisma/client/sql";
import { injectable } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import { PostEntity } from "../modules/entities";

@injectable()
export class PostRepository {
  public async create(params: { chatRoomId?: string, userId: string, content: string }, ctx: AccessContext): Promise<PostEntity> {
    const row = await ctx.db.post.create({
      data: {
        chat_room_id: params.chatRoomId,
        user_id: params.userId,
        content: params.content,
      },
    });
    return this.mapEntity(row);
  }

  public async get(params: { postId: string }, ctx: AccessContext): Promise<PostEntity | undefined> {
    const row = await ctx.db.post.findFirst({
      where: {
        post_id: params.postId,
      },
    });
    if (row == null) {
      return undefined;
    }
    return this.mapEntity(row);
  }

  public async fetchTimeline(params: { kind: 'home', cursor?: string, limit?: number }, ctx: AccessContext): Promise<PostEntity[]> {
    const limit = params.limit ?? 50;
    if (params.cursor != null) {
      const rows = await ctx.db.$queryRawTyped(sql.fetchHomeTimelineCursor(ctx.userId, params.cursor, limit));
      return rows.map(x => this.mapEntity(x));
    } else {
      const rows = await ctx.db.$queryRawTyped(sql.fetchHomeTimeline(ctx.userId, limit));
      return rows.map(x => this.mapEntity(x));
    }
  }

  /**
   * @returns 削除に成功したかどうか
  */
  public async delete(params: { postId: string }, ctx: AccessContext): Promise<boolean> {
    const result = await ctx.db.post.deleteMany({
      where: {
        post_id: params.postId,
      },
    });
    return (result.count > 0);
  }

  private mapEntity(row: post): PostEntity {
    return {
      postId: row.post_id,
      chatRoomId: row.chat_room_id ?? undefined,
      userId: row.user_id,
      content: row.content,
    };
  }
}
