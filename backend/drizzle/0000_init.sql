CREATE TABLE IF NOT EXISTS "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"passwordAuthEnabled" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passwordAuth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accountId" uuid NOT NULL,
	"algorithm" varchar(16) NOT NULL,
	"salt" varchar(32) NOT NULL,
	"iteration" integer NOT NULL,
	"hash" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accountId" uuid NOT NULL,
	"name" varchar(64) NOT NULL,
	"displayName" varchar(64) DEFAULT 'frost user' NOT NULL,
	CONSTRAINT "user_name_unique" UNIQUE("name")
);
