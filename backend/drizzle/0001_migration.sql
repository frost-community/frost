CREATE TABLE IF NOT EXISTS "post" (
	"post_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_room_id" uuid,
	"user_id" uuid NOT NULL,
	"content" varchar(256) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "token" ALTER COLUMN "user_id" SET NOT NULL;