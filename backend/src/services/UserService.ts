import { AccessContext } from "../modules/AccessContext";
import { appError, BadRequest, ResourceNotFound } from "../modules/appErrors";
import { DB } from "../modules/db";
import { AuthResultEntity, UserEntity } from "../modules/entities";
import * as UserRepository from "../repositories/UserRepository";
import * as PasswordVerificationService from "./PasswordVerificationService";
import * as TokenService from "./TokenService";

export async function signup(
  params: { name: string, displayName: string, password?: string },
  ctx: AccessContext,
  db: DB,
): Promise<AuthResultEntity> {
  if (params.name.length < 5) {
    throw appError(new BadRequest([
      { message: 'name invalid.' },
    ]));
  }

  if (params.password == null) {
    throw appError({
      code: "authMethodRequired",
      message: "Authentication method required.",
      status: 400,
    });
  }

  const user = await UserRepository.create({
    name: params.name,
    displayName: params.displayName,
    passwordAuthEnabled: true,
  }, ctx, db);

  await PasswordVerificationService.create({
    userId: user.userId,
    password: params.password,
  }, ctx, db);

  const scopes = ["user.read", "user.write", "post.read", "post.write", "post.delete"];

  const accessToken = await TokenService.create({
    userId: user.userId,
    tokenKind: "access_token",
    scopes: scopes,
  }, ctx, db);

  const refreshToken = await TokenService.create({
    userId: user.userId,
    tokenKind: "refresh_token",
    scopes: scopes,
  }, ctx, db);

  return { accessToken, refreshToken, user };
}

export async function signin(
  params: { name: string, password?: string },
  ctx: AccessContext,
  db: DB,
): Promise<AuthResultEntity> {
  if (params.name.length < 1) {
    throw appError(new BadRequest([
      { message: 'name invalid.' },
    ]));
  }

  const user = await UserRepository.get({
    name: params.name,
  }, ctx, db);

  if (user == null) {
    throw appError(new ResourceNotFound("User"));
  }

  if (user.passwordAuthEnabled) {
    if (params.password == null || params.password.length < 1) {
      throw appError(new BadRequest([
        { message: 'password invalid.' },
      ]));
    }
    const verification = await PasswordVerificationService.verifyPassword({
      userId: user.userId,
      password: params.password,
    }, ctx, db);
    if (!verification) {
      throw appError({
        code: "incorrectCredential",
        message: "The username and/or password is incorrect.",
        status: 401,
      });
    }
    const scopes = ["user.read", "user.write", "post.read", "post.write", "post.delete"];
    const accessToken = await TokenService.create({
      userId: user.userId,
      tokenKind: "access_token",
      scopes: scopes,
    }, ctx, db);
    const refreshToken = await TokenService.create({
      userId: user.userId,
      tokenKind: "refresh_token",
      scopes: scopes,
    }, ctx, db);
    return { accessToken, refreshToken, user };
  }

  throw new Error("authentication method not exists: " + user.userId);
}

export async function get(
  params: { userId?: string, name?: string },
  ctx: AccessContext,
  db: DB,
): Promise<UserEntity> {
  // either userId or name must be specified
  if ([params.userId, params.name].every(x => x == null)) {
    throw appError(new BadRequest([
      { message: "Please specify the userId or name." },
    ]));
  }

  const userEntity = await UserRepository.get({
    userId: params.userId,
    name: params.name,
  }, ctx, db);

  if (userEntity == null) {
    throw appError(new ResourceNotFound("User"));
  }

  return userEntity;
}

export async function remove(
  params: { userId: string },
  ctx: AccessContext,
  db: DB,
): Promise<void> {
  const success = await UserRepository.remove({
    userId: params.userId,
  }, ctx, db);

  if (!success) {
    throw appError(new ResourceNotFound("User"));
  }
}
