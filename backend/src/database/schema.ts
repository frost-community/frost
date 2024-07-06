import * as D from 'drizzle-orm/pg-core';

// users

export const UsersTable = D.pgTable('users', {
  id: D.uuid('id').primaryKey(),
});

export type UserRow = typeof UsersTable.$inferSelect;

export type UserInsertParams = typeof UsersTable.$inferInsert;

// profiles

export const ProfilesTable = D.pgTable('profiles', {
  id: D.uuid('id').primaryKey(),
  userId: D.uuid('userId').notNull(),
  name: D.varchar('name', { length: 64 }).notNull().default('frost user'),
});

export type ProfileRow = typeof ProfilesTable.$inferSelect;

export type ProfileInsertParams = typeof ProfilesTable.$inferInsert;
