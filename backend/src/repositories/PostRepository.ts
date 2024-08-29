import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { CreatePostParameters, PostRecord, postTable } from "../database/schema";
import { AccessContext } from "../modules/AccessContext";
import { PostEntity } from "../modules/entities";

@injectable()
export class PostRepository {
  public async create(params: CreatePostParameters, ctx: AccessContext): Promise<PostEntity> {
    const rows = await ctx.db.getCurrent()
      .insert(postTable)
      .values(params)
      .returning();
    const row = rows[0]!;
    return this.mapEntity(row);
  }

  public async get(params: { postId: string }, ctx: AccessContext): Promise<PostEntity | undefined> {
    const rows = await ctx.db.getCurrent()
      .select()
      .from(postTable)
      .where(eq(postTable.postId, params.postId))
    if (rows.length == 0) {
      return undefined;
    }
    const row = rows[0]!;
    return this.mapEntity(row);
  }

  /**
   * @returns 削除に成功したかどうか
  */
  public async delete(params: { postId: string }, ctx: AccessContext): Promise<boolean> {
    const rows = await ctx.db.getCurrent()
      .delete(postTable)
      .where(eq(postTable.postId, params.postId));
    if (rows.rowCount == 0) {
      return false;
    }
    return true;
  }

  private mapEntity(row: PostRecord): PostEntity {
    return {
      postId: row.postId,
      chatRoomId: row.chatRoomId ?? undefined,
      userId: row.userId,
      content: row.content,
    };
  }
}
