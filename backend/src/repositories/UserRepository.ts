import { user } from "@prisma/client";
import { injectable } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import { UserEntity } from "../modules/entities";

@injectable()
export class UserRepository {
  public async create(params: { name: string, displayName: string, passwordAuthEnabled: boolean }, ctx: AccessContext): Promise<UserEntity> {
    const row = await ctx.db.user.create({
      data: {
        name: params.name,
        display_name: params.displayName,
        password_auth_enabled: params.passwordAuthEnabled,
      },
    });
    return this.mapEntity(row);
  }

  public async get(params: { userId?: string, name?: string }, ctx: AccessContext): Promise<UserEntity | undefined> {
    if ([params.userId, params.name].every(x => x == null)) {
      throw new Error("invalid condition");
    }
    const row = await ctx.db.user.findFirst({
      where: {
        user_id: params.userId,
        name: params.name,
      }
    });
    if (row == null) {
      return undefined;
    }
    return this.mapEntity(row);
  }

  /**
   * @returns 削除に成功したかどうか
  */
  public async delete(params: { userId: string }, ctx: AccessContext): Promise<boolean> {
    const result = await ctx.db.user.deleteMany({
      where: {
        user_id: params.userId,
      },
    });
    return (result.count > 0);
  }

  private mapEntity(row: user): UserEntity {
    return {
      userId: row.user_id,
      name: row.name,
      displayName: row.display_name,
      passwordAuthEnabled: row.password_auth_enabled,
    };
  }
}
