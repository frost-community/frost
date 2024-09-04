import express from "express";
import z from 'zod';
import { UserEntity } from "../entities";
import { appError, BadRequest } from "../appErrors";
import { PrismaClient } from "@prisma/client";
import { PrismaTransaction } from "./ApiRouteBuilder";

export class ApiRouteContext {
  private _user: UserEntity | undefined;
  private _scopes: string[] | undefined;
  constructor(
    public params: unknown,
    public db: PrismaClient | PrismaTransaction,
    public req: express.Request,
    public res: express.Response,
    user: UserEntity | undefined,
    scopes: string[] | undefined,
  ) {
    this._user = user;
    this._scopes = scopes;
  }
  
  public getUser(): UserEntity {
    if (this._user == null) throw new Error('not authenticated');
    return this._user;
  }

  public getScopes(): string[] {
    if (this._scopes == null) throw new Error('not authenticated');
    return this._scopes;
  }

  public validateParams<T>(schema: z.ZodType<T>): T {
    const result = schema.safeParse(this.params);
    if (!result.success) {
      throw appError(new BadRequest(
        result.error.issues.map(x => {
          return { code: x.code, path: x.path, message: x.message };
        })
      ));
    }
    return result.data;
  }
}
