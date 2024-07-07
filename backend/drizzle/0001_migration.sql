ALTER TABLE "users" RENAME TO "account";--> statement-breakpoint
ALTER TABLE "profiles" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "userId" TO "accountId";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();