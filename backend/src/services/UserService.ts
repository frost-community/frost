import { and, eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Database } from './DatabaseService';
import { User } from '../database/schema';
import { createError, InvalidParam, UserNotFound } from '../modules/service-error';
import { PasswordVerificationService } from './PasswordVerificationService';
import { TokenService } from './TokenService';
import { AuthResultEntity, UserEntity } from '../modules/entities';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.PasswordVerificationService) private readonly passwordVerificationService: PasswordVerificationService,
    @inject(TYPES.TokenService) private readonly tokenService: TokenService,
  ) {}

  async signup(params: { name: string, displayName: string, password?: string }, db: Database): Promise<AuthResultEntity> {
    if (params.password == null) {
      throw createError({ code: 'authMethodRequired', message: 'Authentication method required.', status: 400 });
    }
    const user = await this.create({
      name: params.name,
      displayName: params.displayName,
      passwordAuthEnabled: true,
    }, db);
    await this.passwordVerificationService.register({
      userId: user.userId,
      password: params.password,
    }, db);
    const accessToken = await this.tokenService.createToken({
      userId: user.userId,
      tokenKind: 'access_token',
      scopes: ['user.read'],
    }, db);
    const refreshToken = await this.tokenService.createToken({
      userId: user.userId,
      tokenKind: 'refresh_token',
      scopes: ['user.read'],
    }, db);
    return { accessToken, refreshToken, user };
  }

  async signin(params: { name: string, password?: string }, db: Database): Promise<AuthResultEntity> {
    const user = await this.get({
      name: params.name,
    }, db);
    if (user.passwordAuthEnabled) {
      if (params.password == null) {
        throw createError(new InvalidParam([{ path: 'password', message: '"password" field required.' }]));
      }
      const verification = await this.passwordVerificationService.verifyPassword({
        userId: user.userId,
        password: params.password,
      }, db);
      if (!verification) {
        throw createError({ code: 'signinFailure', message: 'Signin failure.', status: 401 });
      }
      const accessToken = await this.tokenService.createToken({
        userId: user.userId,
        tokenKind: 'access_token',
        scopes: ['user.read'],
      }, db);
      const refreshToken = await this.tokenService.createToken({
        userId: user.userId,
        tokenKind: 'refresh_token',
        scopes: ['user.read'],
      }, db);
      return { accessToken, refreshToken, user };
    }
    throw new Error('authentication method not exists: ' + user.userId);
  }

  async create(params: { name: string, displayName: string, passwordAuthEnabled: boolean }, db: Database): Promise<UserEntity> {
    const rows = await db.getConnection()
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

  async get(params: { userId?: string, name?: string }, db: Database): Promise<UserEntity> {
    // either userId or name must be specified
    if ([params.userId, params.name].every(x => x == null)) {
      throw createError(new UserNotFound({ userId: params.userId, userName: params.name }));
    }
    const rows = await db.getConnection()
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
      throw createError(new UserNotFound({ userId: params.userId }));
    }
    const user = rows[0]!;

    return user;
  }

  async delete(params: { userId: string }, db: Database): Promise<void> {
    const rows = await db.getConnection()
      .delete(
        User
      )
      .where(
        eq(User.userId, params.userId)
      );

    if (rows.rowCount == 0) {
      throw createError(new UserNotFound({ userId: params.userId }));
    }
  }
}
