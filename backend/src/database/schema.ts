import * as D from 'drizzle-orm/pg-core';

// account

export const Account = D.pgTable('account', {
  accountId: D.uuid('account_id').primaryKey().defaultRandom(),
  name: D.varchar('name', { length: 64 }).unique().notNull(),
  passwordAuthEnabled: D.boolean('password_auth_enabled').notNull(),
});
export type InferSelectAccount = typeof Account.$inferSelect;
export type InferInsertAccount = typeof Account.$inferInsert;

// password verification

export const PasswordVerification = D.pgTable('password_verification', {
  passwordVerificationId: D.uuid('password_verification_id').primaryKey().defaultRandom(),
  accountId: D.uuid('account_id').notNull(),
  algorithm: D.varchar('algorithm', { length: 16 }).notNull(),
  salt: D.varchar('salt', { length: 32 }).notNull(),
  iteration: D.integer('iteration').notNull(),
  hash: D.varchar('hash', { length: 128 }).notNull(),
});
export type InferSelectPasswordVerification = typeof PasswordVerification.$inferSelect;
export type InferInsertPasswordVerification = typeof PasswordVerification.$inferInsert;

// user

export const User = D.pgTable('user', {
  userId: D.uuid('user_id').primaryKey().defaultRandom(),
  accountId: D.uuid('account_id').notNull(),
  name: D.varchar('name', { length: 64 }).unique().notNull(),
  displayName: D.varchar('display_name', { length: 64 }).default('frost user').notNull(),
});
export type InferSelectUser = typeof User.$inferSelect;
export type InferInsertUser = typeof User.$inferInsert;
