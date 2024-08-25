import { and, eq, SQL } from "drizzle-orm";
import { injectable } from "inversify";
import { CreateUserParameters, userTable } from "../database/schema";
import { AccessContext } from "../types/access-context";
import { UserEntity } from "../types/entities";

@injectable()
export class UserRepository {
  public async create(params: CreateUserParameters, ctx: AccessContext): Promise<UserEntity> {
    const rows = await ctx.db.getCurrent()
      .insert(userTable)
      .values(params)
      .returning();
    const row = rows[0]!;
    return row;
  }

  public async get(params: { userId?: string, name?: string }, ctx: AccessContext): Promise<UserEntity | undefined> {
    if ([params.userId, params.name].every(x => x == null)) {
      throw new Error("invalid condition");
    }
    const conditions: SQL[] = [];
    if (params.userId != null) {
      conditions.push(eq(userTable.userId, params.userId));
    }
    if (params.name != null) {
      conditions.push(eq(userTable.name, params.name));
    }
    const rows = await ctx.db.getCurrent()
      .select({
        userId: userTable.userId,
        name: userTable.name,
        displayName: userTable.displayName,
        passwordAuthEnabled: userTable.passwordAuthEnabled,
      })
      .from(userTable)
      .where(and(...conditions));
    if (rows.length == 0) {
      return undefined;
    }
    const row = rows[0]!;
    return row;
  }

  /**
   * @returns 削除に成功したかどうか
  */
  public async delete(params: { userId: string }, ctx: AccessContext): Promise<boolean> {
    const rows = await ctx.db.getCurrent()
      .delete(userTable)
      .where(eq(userTable.userId, params.userId));
    if (rows.rowCount == 0) {
      return false;
    }
    return true;
  }
}
