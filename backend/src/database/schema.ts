import * as D from 'drizzle-orm/pg-core';

// account

export const AccountTable = D.pgTable('account', {
  id: D.uuid('id').primaryKey().defaultRandom(),
});

export type AccountRow = typeof AccountTable.$inferSelect;

export type AccountInsertParams = typeof AccountTable.$inferInsert;

// user

export const UserTable = D.pgTable('user', {
  id: D.uuid('id').primaryKey().defaultRandom(),
  accountId: D.uuid('accountId').notNull(),
  name: D.varchar('name', { length: 64 }).notNull().default('frost user'),
});

export type UserRow = typeof UserTable.$inferSelect;

export type UserInsertParams = typeof UserTable.$inferInsert;
