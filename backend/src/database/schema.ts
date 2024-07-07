import * as D from 'drizzle-orm/pg-core';

// account

export const AccountTable = D.pgTable('account', {
  id: D.uuid('id').primaryKey().defaultRandom(),
  name: D.varchar('name', { length: 64 }),
  passwordAuthEnabled: D.boolean('passwordAuthEnabled'),
});

export type AccountRow = typeof AccountTable.$inferSelect;

export type AccountInsertParams = typeof AccountTable.$inferInsert;

// passwordAuth

export const PasswordAuthTable = D.pgTable('passwordAuth', {
  id: D.uuid('id').primaryKey(),
  accountId: D.uuid('accountId').notNull(),
  algorithm: D.varchar('algorithm', { length: 16, enum: ['sha3-512'] }),
  salt: D.integer('salt'),
  hash: D.varchar('hash', { length: 256 }),
});

export type PasswordAuthRow = typeof PasswordAuthTable.$inferSelect;

export type PasswordAuthInsertParams = typeof PasswordAuthTable.$inferInsert;

// user

export const UserTable = D.pgTable('user', {
  id: D.uuid('id').primaryKey().defaultRandom(),
  accountId: D.uuid('accountId').notNull(),
  name: D.varchar('name', { length: 64 }).unique(),
  displayName: D.varchar('displayName', { length: 64 }).default('frost user'),
});

export type UserRow = typeof UserTable.$inferSelect;

export type UserInsertParams = typeof UserTable.$inferInsert;
