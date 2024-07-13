import * as D from 'drizzle-orm/pg-core';

// account

export const Account = D.pgTable('account', {
  accountId: D.uuid('accountId').primaryKey().defaultRandom(),
  name: D.varchar('name', { length: 64 }).notNull(),
  passwordAuthEnabled: D.boolean('passwordAuthEnabled').notNull(),
});

export type AccountRow = typeof Account.$inferSelect;

export type AccountInsertParams = typeof Account.$inferInsert;

// password verification

export const PasswordVerification = D.pgTable('passwordVerification', {
  passwordVerificationId: D.uuid('passwordVerificationId').primaryKey().defaultRandom(),
  accountId: D.uuid('accountId').notNull(),
  algorithm: D.varchar('algorithm', { length: 16 }).notNull(),
  salt: D.varchar('salt', { length: 32 }).notNull(),
  iteration: D.integer('iteration').notNull(),
  hash: D.varchar('hash', { length: 128 }).notNull(),
});

export type PasswordVerificationRow = typeof PasswordVerification.$inferSelect;

export type PasswordVerificationInsertParams = typeof PasswordVerification.$inferInsert;

// user

export const User = D.pgTable('user', {
  userId: D.uuid('userId').primaryKey().defaultRandom(),
  accountId: D.uuid('accountId').notNull(),
  name: D.varchar('name', { length: 64 }).unique().notNull(),
  displayName: D.varchar('displayName', { length: 64 }).default('frost user').notNull(),
});

export type UserRow = typeof User.$inferSelect;

export type UserInsertParams = typeof User.$inferInsert;
