CREATE TABLE IF NOT EXISTS "token" (
	"token_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_kind" varchar(16) NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(32) NOT NULL,
	"expires" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "token_scope" (
	"token_scope_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid NOT NULL,
	"scope_name" varchar(32) NOT NULL
);
