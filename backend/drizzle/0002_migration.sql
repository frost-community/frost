CREATE TABLE IF NOT EXISTS "passwordAuth" (
	"id" uuid PRIMARY KEY NOT NULL,
	"accountId" uuid NOT NULL,
	"algorithm" varchar(16),
	"salt" integer,
	"hash" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "name" TO "displayName";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "displayName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "name" varchar(64);--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "passwordAuthEnabled" boolean;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "name" varchar(64);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_name_unique" UNIQUE("name");
