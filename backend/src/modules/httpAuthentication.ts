import express from "express";
import { Container } from "inversify";
import { TYPES } from "../container/types";
import passport from "passport";
import { Strategy as BearerStrategy, IVerifyOptions } from "passport-http-bearer";
import { UserService } from "../services/UserService";
import { ConnectionPool } from "./database";
import { TokenService } from "../services/TokenService";
import { appError, Unauthenticated } from "./apiErrors";
import { BACKEND_URSR_ID } from "../constants/specialUserId";

export function configureServer(container: Container) {
  const databaseService = container.get<ConnectionPool>(TYPES.ConnectionPool);
  const tokenService = container.get<TokenService>(TYPES.TokenService);
  const userService = container.get<UserService>(TYPES.UserService);

  passport.use(new BearerStrategy(async (token, done) => {
    let db;
    try {
      db = await databaseService.acquire();
      const ctx = { userId: BACKEND_URSR_ID, db };
      const tokenInfo = await tokenService.getTokenInfo({
        token
      }, ctx);
      if (tokenInfo.tokenKind != "access_token") {
        return done(appError(new Unauthenticated()));
      }
      const user = await userService.get({
        userId: tokenInfo.userId
      }, ctx);
      return done(null, user, { scope: tokenInfo.scopes });
    } catch (err) {
      return done(err);
    } finally {
      if (db != null) db.dispose();
    }
  }));
}

export function authenticate(params?: { scope?: string | string[] }) {
  const authBearer = passport.authenticate("bearer", { session: false });

  const checkScopes = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.user);
    console.log(req.authInfo);
    const requiredScope = params?.scope ?? [];
    next();
  };

  return [
    authBearer,
    checkScopes,
  ];
}
