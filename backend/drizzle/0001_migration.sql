ALTER TABLE "passwordVerification" RENAME TO "password_verification";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "accountId" TO "account_id";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "passwordAuthEnabled" TO "password_auth_enabled";--> statement-breakpoint
ALTER TABLE "password_verification" RENAME COLUMN "passwordVerificationId" TO "password_verification_id";--> statement-breakpoint
ALTER TABLE "password_verification" RENAME COLUMN "accountId" TO "account_id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "accountId" TO "account_id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "displayName" TO "display_name";