import { password_verification, Prisma } from "@prisma/client";
import { injectable } from "inversify";
import { AccessContext } from "../modules/AccessContext";

/**
 * パスワード検証情報
*/
@injectable()
export class PasswordVerificationRepository {
  public async create(params: { userId: string, algorithm: string, salt: string, iteration: number, hash: string }, ctx: AccessContext): Promise<password_verification> {
    const row = await ctx.db.password_verification.create({
      data: {
        user_id: params.userId,
        algorithm: params.algorithm,
        salt: params.salt,
        iteration: params.iteration,
        hash: params.hash,
      },
    });
    return row;
  }

  public async get(params: { userId: string }, ctx: AccessContext): Promise<password_verification | undefined> {
    const row = await ctx.db.password_verification.findFirst({
      where: {
        user_id: params.userId,
      },
    });
    if (row == null) {
      return undefined;
    }
    return row;
  }

  /**
   * @returns 削除に成功したかどうか
  */
  public async delete(params: { userId: string }, ctx: AccessContext): Promise<boolean> {
    const result = await ctx.db.password_verification.deleteMany({
      where: {
        user_id: params.userId,
      },
    });
    return (result.count > 0);
  }
}
