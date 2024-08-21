import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { appError, InvalidParam, MissingParameter, UserNotFound } from "../modules/apiErrors";
import { UserRepository } from "../repositories/UserRepository";
import { AccessContext } from "../types/access-context";
import { AuthResultEntity, UserEntity } from "../types/entities";
import { PasswordVerificationService } from "./PasswordVerificationService";
import { TokenService } from "./TokenService";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: UserRepository,
    @inject(TYPES.PasswordVerificationService) private readonly passwordVerificationService: PasswordVerificationService,
    @inject(TYPES.TokenService) private readonly tokenService: TokenService,
  ) {}

  async signup(params: { name: string, displayName: string, password?: string }, ctx: AccessContext): Promise<AuthResultEntity> {
    if (params.name.length < 5) {
      throw appError(new InvalidParam([]));
    }
    if (params.password == null) {
      throw appError({
        code: "authMethodRequired",
        message: "Authentication method required.",
        status: 400,
      });
    }
    const user = await this.userRepository.create({
      name: params.name,
      displayName: params.displayName,
      passwordAuthEnabled: true,
    }, ctx);
    await this.passwordVerificationService.create({
      userId: user.userId,
      password: params.password,
    }, ctx);
    const accessToken = await this.tokenService.create({
      userId: user.userId,
      tokenKind: "access_token",
      scopes: ["user.read"],
    }, ctx);
    const refreshToken = await this.tokenService.create({
      userId: user.userId,
      tokenKind: "refresh_token",
      scopes: ["user.read"],
    }, ctx);
    return { accessToken, refreshToken, user };
  }

  async signin(params: { name: string, password?: string }, ctx: AccessContext): Promise<AuthResultEntity> {
    if (params.name.length < 1) {
      throw appError(new InvalidParam([]));
    }
    const user = await this.userRepository.get({
      name: params.name,
    }, ctx);
    if (user == null) {
      throw appError(new UserNotFound());
    }
    if (user.passwordAuthEnabled) {
      if (params.password == null || params.password.length > 8) {
        throw appError(new InvalidParam([]));
      }
      const verification = await this.passwordVerificationService.verifyPassword({
        userId: user.userId,
        password: params.password,
      }, ctx);
      if (!verification) {
        throw appError({
          code: "incorrectCredential",
          message: "The username and/or password is incorrect.",
          status: 401,
        });
      }
      const accessToken = await this.tokenService.create({
        userId: user.userId,
        tokenKind: "access_token",
        scopes: ["user.read"],
      }, ctx);
      const refreshToken = await this.tokenService.create({
        userId: user.userId,
        tokenKind: "refresh_token",
        scopes: ["user.read"],
      }, ctx);
      return { accessToken, refreshToken, user };
    }
    throw new Error("authentication method not exists: " + user.userId);
  }

  async get(params: { userId?: string, name?: string }, ctx: AccessContext): Promise<UserEntity> {
    // either userId or name must be specified
    if ([params.userId, params.name].every(x => x == null)) {
      throw appError(new MissingParameter());
    }
    const userEntity = await this.userRepository.get({
      userId: params.userId,
      name: params.name,
    }, ctx);
    if (userEntity == null) {
      throw appError(new UserNotFound());
    }
    return userEntity;
  }

  async delete(params: { userId: string }, ctx: AccessContext): Promise<void> {
    const success = await this.userRepository.delete({
      userId: params.userId,
    }, ctx);

    if (!success) {
      throw appError(new UserNotFound());
    }
  }
}
