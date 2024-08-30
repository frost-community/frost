-- CreateTable
CREATE TABLE "password_verification" (
    "password_verification_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "algorithm" VARCHAR(16) NOT NULL,
    "salt" VARCHAR(32) NOT NULL,
    "iteration" INTEGER NOT NULL,
    "hash" VARCHAR(128) NOT NULL,

    CONSTRAINT "password_verification_pkey" PRIMARY KEY ("password_verification_id")
);

-- CreateTable
CREATE TABLE "post" (
    "post_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chat_room_id" UUID,
    "user_id" UUID NOT NULL,
    "content" VARCHAR(256) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "token" (
    "token_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_kind" VARCHAR(16) NOT NULL,
    "user_id" UUID NOT NULL,
    "token" VARCHAR(32) NOT NULL,
    "expires" TIMESTAMP(6),

    CONSTRAINT "token_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "token_scope" (
    "token_scope_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_id" UUID NOT NULL,
    "scope_name" VARCHAR(32) NOT NULL,

    CONSTRAINT "token_scope_pkey" PRIMARY KEY ("token_scope_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(64) NOT NULL,
    "display_name" VARCHAR(64) NOT NULL DEFAULT 'frost user',
    "password_auth_enabled" BOOLEAN NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_name_unique" ON "user"("name");
