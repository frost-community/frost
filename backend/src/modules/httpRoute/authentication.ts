import express from "express";
import { Container } from "inversify";
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { BACKEND_URSR_ID } from "../../constants/specialUserId";
import { TYPES } from "../../container/types";
import { TokenService } from "../../services/TokenService";
import { UserService } from "../../services/UserService";
import { AccessDenied, appError, Unauthenticated } from "../appErrors";
import { ConnectionPool } from "../database";

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

export function authenticate(scope: string | string[]) {
  const authBearer = passport.authenticate("bearer", { session: false });

  const checkScopes = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let requiredScopes: string[];
    if (Array.isArray(scope)) {
      requiredScopes = scope;
    } else {
      requiredScopes = [scope];
    }
    // check all required scopes
    for (const requiredScope of requiredScopes) {
      if (!(req.authInfo as { scope: string[] }).scope.includes(requiredScope)) {
        next(appError(new AccessDenied()));
        return;
      }
    }
    next();
  };

  return [
    authBearer,
    checkScopes,
  ];
}
