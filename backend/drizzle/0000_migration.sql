CREATE TABLE IF NOT EXISTS "password_verification" (
	"password_verification_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"algorithm" varchar(16) NOT NULL,
	"salt" varchar(32) NOT NULL,
	"iteration" integer NOT NULL,
	"hash" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "token" (
	"token_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_kind" varchar(16) NOT NULL,
	"user_id" uuid,
	"token" varchar(32) NOT NULL,
	"expires" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "token_scope" (
	"token_scope_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid NOT NULL,
	"scope_name" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"display_name" varchar(64) DEFAULT 'frost user' NOT NULL,
	"password_auth_enabled" boolean NOT NULL,
	CONSTRAINT "user_name_unique" UNIQUE("name")
);
