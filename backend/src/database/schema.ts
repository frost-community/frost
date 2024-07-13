import * as D from 'drizzle-orm/pg-core';

// account

export const Account = D.pgTable('account', {
  id: D.uuid('id').primaryKey().defaultRandom(),
  name: D.varchar('name', { length: 64 }).notNull(),
  passwordAuthEnabled: D.boolean('passwordAuthEnabled').notNull(),
});

export type AccountRow = typeof Account.$inferSelect;

export type AccountInsertParams = typeof Account.$inferInsert;

// passwordAuth

export const PasswordAuth = D.pgTable('passwordAuth', {
  id: D.uuid('id').primaryKey().defaultRandom(),
  accountId: D.uuid('accountId').notNull(),
  algorithm: D.varchar('algorithm', { length: 16 }).notNull(),
  salt: D.varchar('salt', { length: 32 }).notNull(),
  iteration: D.integer('iteration').notNull(),
  hash: D.varchar('hash', { length: 128 }).notNull(),
});

export type PasswordAuthRow = typeof PasswordAuth.$inferSelect;

export type PasswordAuthInsertParams = typeof PasswordAuth.$inferInsert;

// user

export const User = D.pgTable('user', {
  id: D.uuid('id').primaryKey().defaultRandom(),
  accountId: D.uuid('accountId').notNull(),
  name: D.varchar('name', { length: 64 }).unique().notNull(),
  displayName: D.varchar('displayName', { length: 64 }).default('frost user').notNull(),
});

export type UserRow = typeof User.$inferSelect;

export type UserInsertParams = typeof User.$inferInsert;
