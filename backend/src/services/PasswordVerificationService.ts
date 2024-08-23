import { inject, injectable } from "inversify";
import crypto from "node:crypto";
import { TYPES } from "../container/types";
import { appError, InvalidParam } from "../modules/appErrors";
import { PasswordVerificationRepository } from "../repositories/PasswordVerificationRepository";
import { AccessContext } from "../types/access-context";

type PasswordVerificationInfo = {
  algorithm: string,
  salt: string,
  iteration: number,
  hash: string,
};

/**
 * パスワード検証情報
*/
@injectable()
export class PasswordVerificationService {
  constructor(
    @inject(TYPES.PasswordVerificationRepository) private readonly passwordVerificationRepository: PasswordVerificationRepository,
  ) {}

  /**
   * パスワードの検証情報を作成します。
  */
  async create(params: { userId: string, password: string }, ctx: AccessContext): Promise<void> {
    if (params.password.length < 8) {
      throw appError(new InvalidParam([]));
    }
    await this.passwordVerificationRepository.create({
      userId: ctx.userId,
      ...this.generateInfo({
        password: params.password,
      }),
    }, ctx);
  }

  /**
   * パスワード検証情報を用いてパスワードが正しいかどうかを確認します。
  */
  async verifyPassword(params: { userId: string, password: string }, ctx: AccessContext): Promise<boolean> {
    if (params.password.length < 8) {
      throw appError(new InvalidParam([]));
    }
    const info = await this.passwordVerificationRepository.get({
      userId: params.userId,
    }, ctx);
    if (info == null) {
      throw new Error("PasswordVerification record not found");
    }
    const hash = this.generateHash({
      token: params.password,
      algorithm: info.algorithm,
      salt: info.salt,
      iteration: info.iteration,
    });
    return (hash === info.hash);
  }

  /**
   * パスワード認証情報を生成します。
  */
  private generateInfo(params: { password: string }): PasswordVerificationInfo {
    const algorithm = "sha256";
    const salt = this.generateSalt();
    const iteration = 100000;
    const hash = this.generateHash({
      token: params.password,
      algorithm,
      salt,
      iteration,
    });
    return {
      algorithm,
      salt,
      iteration,
      hash,
    };
  }

  /**
   * ハッシュを生成します。
  */
  private generateHash(params: { token: string, algorithm: string, salt: string, iteration: number }): string {
    if (params.iteration < 1) {
      throw new Error("The iteration value must be 1 or greater");
    }
    let token = params.token;
    for (let i = 0; i < params.iteration; i++) {
      token = crypto.hash(params.algorithm, token + params.salt, "hex");
    }
    return token;
  }

  /**
   * 塩を生成します。
  */
  private generateSalt(): string {
    // 128bit random (length = 32)
    return crypto.randomBytes(16).toString("hex");
  }
}
