import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { CreatePasswordVerificationParameters, PasswordVerificationRecord, passwordVerificationTable } from "../database/schema";
import { AccessContext } from "../types/access-context";

/**
 * パスワード検証情報
*/
@injectable()
export class PasswordVerificationRepository {
  public async create(params: CreatePasswordVerificationParameters, ctx: AccessContext): Promise<PasswordVerificationRecord> {
    const rows = await ctx.db.getCurrent()
      .insert(passwordVerificationTable)
      .values(params)
      .returning();
    const row = rows[0]!;
    return row;
  }

  public async get(params: { userId: string }, ctx: AccessContext): Promise<PasswordVerificationRecord | undefined> {
    const rows = await ctx.db.getCurrent()
      .select()
      .from(passwordVerificationTable)
      .where(eq(passwordVerificationTable.userId, params.userId));
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
      .delete(passwordVerificationTable)
      .where(eq(passwordVerificationTable.userId, params.userId));
    if (rows.rowCount == 0) {
      return false;
    }
    return true;
  }
}
