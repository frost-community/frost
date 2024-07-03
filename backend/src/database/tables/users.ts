import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  userId: uuid('userId').defaultRandom().primaryKey(),
});
export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
