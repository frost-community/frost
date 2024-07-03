import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const accountsTable = pgTable('accounts', {
  accountId: uuid('accountId').defaultRandom().primaryKey(),
  userId: uuid('userId'),
  name: varchar('name', { length: 32 }),
});
export type Account = typeof accountsTable.$inferSelect;
export type AccountInsert = typeof accountsTable.$inferInsert;
