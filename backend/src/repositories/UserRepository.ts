import { and, eq } from "drizzle-orm";
import { injectable } from "inversify";
import { CreateUserParameters, userTable } from "../database/schema";
import { AccessContext } from "../types/access-context";
import { UserEntity } from "../types/entities";

@injectable()
export class UserRepository {
  async create(params: CreateUserParameters, ctx: AccessContext): Promise<UserEntity> {
    const rows = await ctx.db.getCurrent()
      .insert(userTable)
      .values(params)
      .returning();
    const row = rows[0]!;
    return row;
  }

  async get(params: { userId?: string, name?: string }, ctx: AccessContext): Promise<UserEntity | undefined> {
    if ([params.userId, params.name].every(x => x == null)) {
      throw new Error("invalid condition");
    }
    const rows = await ctx.db.getCurrent()
      .select({
        userId: userTable.userId,
        name: userTable.name,
        displayName: userTable.displayName,
        passwordAuthEnabled: userTable.passwordAuthEnabled,
      })
      .from(userTable)
      .where(
        and(
          eq(userTable.userId, params.userId != null ? params.userId : userTable.userId),
          eq(userTable.name, params.name != null ? params.name : userTable.name)
        )
      );
    if (rows.length == 0) {
      return undefined;
    }
    const row = rows[0]!;
    return row;
  }

  /**
   * @returns 削除に成功したかどうか
  */
  async delete(params: { userId: string }, ctx: AccessContext): Promise<boolean> {
    const rows = await ctx.db.getCurrent()
      .delete(userTable)
      .where(eq(userTable.userId, params.userId));
    if (rows.rowCount == 0) {
      return false;
    }
    return true;
  }
}
