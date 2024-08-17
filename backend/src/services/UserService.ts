import { and, eq } from "drizzle-orm";
import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { User } from "../database/schema";
import { appError, InvalidParam, UserNotFound } from "../modules/apiErrors";
import { PasswordVerificationService } from "./PasswordVerificationService";
import { TokenService } from "./TokenService";
import { AuthResultEntity, UserEntity } from "../types/entities";
import { AccessContext } from "../types/access-context";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.PasswordVerificationService) private readonly passwordVerificationService: PasswordVerificationService,
    @inject(TYPES.TokenService) private readonly tokenService: TokenService,
  ) {}

  async signup(params: { name: string, displayName: string, password?: string }, ctx: AccessContext): Promise<AuthResultEntity> {
    if (params.password == null) {
      throw appError({ code: "authMethodRequired", message: "Authentication method required.", status: 400 });
    }
    const user = await this.create({
      name: params.name,
      displayName: params.displayName,
      passwordAuthEnabled: true,
    }, ctx);
    await this.passwordVerificationService.register({
      userId: user.userId,
      password: params.password,
    }, ctx);
    const accessToken = await this.tokenService.createToken({
      userId: user.userId,
      tokenKind: "access_token",
      scopes: ["user.read"],
    }, ctx);
    const refreshToken = await this.tokenService.createToken({
      userId: user.userId,
      tokenKind: "refresh_token",
      scopes: ["user.read"],
    }, ctx);
    return { accessToken, refreshToken, user };
  }

  async signin(params: { name: string, password?: string }, ctx: AccessContext): Promise<AuthResultEntity> {
    const user = await this.get({
      name: params.name,
    }, ctx);
    if (user.passwordAuthEnabled) {
      if (params.password == null) {
        throw appError(new InvalidParam([{ path: "password", message: '"password" field required.' }]));
      }
      const verification = await this.passwordVerificationService.verifyPassword({
        userId: user.userId,
        password: params.password,
      }, ctx);
      if (!verification) {
        throw appError({ code: "signinFailure", message: "Signin failure.", status: 401 });
      }
      const accessToken = await this.tokenService.createToken({
        userId: user.userId,
        tokenKind: "access_token",
        scopes: ["user.read"],
      }, ctx);
      const refreshToken = await this.tokenService.createToken({
        userId: user.userId,
        tokenKind: "refresh_token",
        scopes: ["user.read"],
      }, ctx);
      return { accessToken, refreshToken, user };
    }
    throw new Error("authentication method not exists: " + user.userId);
  }

  private async create(params: { name: string, displayName: string, passwordAuthEnabled: boolean }, ctx: AccessContext): Promise<UserEntity> {
    const rows = await ctx.db.getCurrent()
      .insert(
        User
      )
      .values({
        name: params.name,
        displayName: params.displayName,
        passwordAuthEnabled: params.passwordAuthEnabled,
      })
      .returning();
    const user = rows[0]!;

    return user;
  }

  async get(params: { userId?: string, name?: string }, ctx: AccessContext): Promise<UserEntity> {
    // either userId or name must be specified
    if ([params.userId, params.name].every(x => x == null)) {
      throw appError(new UserNotFound({ userId: params.userId, userName: params.name }));
    }
    const rows = await ctx.db.getCurrent()
      .select({
        userId: User.userId,
        name: User.name,
        displayName: User.displayName,
        passwordAuthEnabled: User.passwordAuthEnabled,
      })
      .from(
        User
      )
      .where(
        and(
          eq(User.userId, params.userId != null ? params.userId : User.userId),
          eq(User.name, params.name != null ? params.name : User.name)
        )
      );

    if (rows.length == 0) {
      throw appError(new UserNotFound({ userId: params.userId }));
    }
    const user = rows[0]!;

    return user;
  }

  async delete(params: { userId: string }, ctx: AccessContext): Promise<void> {
    const rows = await ctx.db.getCurrent()
      .delete(
        User
      )
      .where(
        eq(User.userId, params.userId)
      );

    if (rows.rowCount == 0) {
      throw appError(new UserNotFound({ userId: params.userId }));
    }
  }
}
