import * as D from 'drizzle-orm/pg-core';

// user

export const userTable = D.pgTable('user', {
  userId: D.uuid('user_id').primaryKey().defaultRandom(),
  name: D.varchar('name', { length: 64 }).unique().notNull(),
  displayName: D.varchar('display_name', { length: 64 }).default('frost user').notNull(),
  passwordAuthEnabled: D.boolean('password_auth_enabled').notNull(),
});
export type UserRecord = typeof userTable.$inferSelect;
export type CreateUserParameters = typeof userTable.$inferInsert;

// password verification

export const passwordVerificationTable = D.pgTable('password_verification', {
  passwordVerificationId: D.uuid('password_verification_id').primaryKey().defaultRandom(),
  userId: D.uuid('user_id').notNull(),
  algorithm: D.varchar('algorithm', { length: 16 }).notNull(),
  salt: D.varchar('salt', { length: 32 }).notNull(),
  iteration: D.integer('iteration').notNull(),
  hash: D.varchar('hash', { length: 128 }).notNull(),
});
export type PasswordVerificationRecord = typeof passwordVerificationTable.$inferSelect;
export type CreatePasswordVerificationParameters = typeof passwordVerificationTable.$inferInsert;

// token

export const tokenTable = D.pgTable('token', {
  tokenId: D.uuid('token_id').primaryKey().defaultRandom(),
  tokenKind: D.varchar('token_kind', { length: 16 }).notNull(), // access_token, refresh_token
  userId: D.uuid('user_id').notNull(),
  token: D.varchar('token', { length: 32 }).notNull(),
  expires: D.timestamp('expires', { mode: 'string' }), // nullは無期限を表す
});
export type TokenRecord = typeof tokenTable.$inferSelect;
export type CreateTokenParameters = typeof tokenTable.$inferInsert;

// token scope

export const tokenScopeTable = D.pgTable('token_scope', {
  tokenScopeId: D.uuid('token_scope_id').primaryKey().defaultRandom(),
  tokenId: D.uuid('token_id').notNull(),
  scopeName: D.varchar('scope_name', { length: 32 }).notNull(),
});
export type TokenScopeRecord = typeof tokenScopeTable.$inferSelect;
export type CreateTokenScopeParameters = typeof tokenScopeTable.$inferInsert;

// post

export const postTable = D.pgTable('post', {
  postId: D.uuid('post_id').primaryKey().defaultRandom(),
  chatRoomId: D.uuid('chat_room_id'),
  userId: D.uuid('user_id').notNull(),
  content: D.varchar('content', { length: 256 }).notNull(),
});
export type PostRecord = typeof postTable.$inferSelect;
export type CreatePostParameters = typeof postTable.$inferInsert;
