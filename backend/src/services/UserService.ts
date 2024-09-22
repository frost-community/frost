import { Container } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import { appError, BadRequest, ResourceNotFound } from "../modules/appErrors";
import { AuthResultEntity, UserEntity } from "../modules/entities";
import * as UserRepository from "../repositories/UserRepository";
import * as PasswordVerificationService from "./PasswordVerificationService";
import * as TokenService from "./TokenService";

/**
 * ユーザーを登録します。
 * 登録に成功すると、そのユーザーのトークンと登録情報が返されます。
*/
export async function signup(
  params: { name: string, displayName: string, password?: string },
  ctx: AccessContext,
  container: Container,
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
  }, ctx, container);

  await PasswordVerificationService.create({
    userId: user.userId,
    password: params.password,
  }, ctx, container);

  const scopes = ["user.read", "user.write", "post.read", "post.write", "post.delete"];

  const accessToken = await TokenService.create({
    userId: user.userId,
    tokenKind: "access_token",
    scopes: scopes,
  }, ctx, container);

  const refreshToken = await TokenService.create({
    userId: user.userId,
    tokenKind: "refresh_token",
    scopes: scopes,
  }, ctx, container);

  return { accessToken, refreshToken, user };
}

/**
 * 指定された認証情報でユーザーを認証します。
 * 認証に成功すると、そのユーザーのトークンと登録情報が返されます。
*/
export async function signin(
  params: { name: string, password?: string },
  ctx: AccessContext,
  container: Container,
): Promise<AuthResultEntity> {
  if (params.name.length < 1) {
    throw appError(new BadRequest([
      { message: 'name invalid.' },
    ]));
  }

  const user = await UserRepository.get({
    name: params.name,
  }, ctx, container);

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
    }, ctx, container);
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
    }, ctx, container);
    const refreshToken = await TokenService.create({
      userId: user.userId,
      tokenKind: "refresh_token",
      scopes: scopes,
    }, ctx, container);
    return { accessToken, refreshToken, user };
  }

  throw new Error("authentication method not exists: " + user.userId);
}

/**
 * ユーザー情報を取得します。
*/
export async function getUser(
  params: { userId?: string, name?: string },
  ctx: AccessContext,
  container: Container,
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
  }, ctx, container);

  if (userEntity == null) {
    throw appError(new ResourceNotFound("User"));
  }

  return userEntity;
}

/**
 * ユーザー情報を削除します。
*/
export async function deleteUser(
  params: { userId: string },
  ctx: AccessContext,
  container: Container,
): Promise<void> {
  const success = await UserRepository.remove({
    userId: params.userId,
  }, ctx, container);

  if (!success) {
    throw appError(new ResourceNotFound("User"));
  }
}
