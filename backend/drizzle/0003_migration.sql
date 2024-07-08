ALTER TABLE "account" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "passwordAuthEnabled" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "passwordAuth" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "passwordAuth" ALTER COLUMN "algorithm" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "passwordAuth" ALTER COLUMN "salt" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "passwordAuth" ALTER COLUMN "salt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "passwordAuth" ALTER COLUMN "hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "displayName" SET NOT NULL;