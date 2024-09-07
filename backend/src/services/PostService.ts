import { AccessContext } from "../modules/AccessContextOld";
import { AccessDenied, appError, BadRequest, ResourceNotFound } from "../modules/appErrors";
import { DB } from "../modules/db";
import { PostEntity } from "../modules/entities";
import * as PostRepository from "../repositories/PostRepository";

export async function createTimelinePost(
  params: { content: string },
  ctx: AccessContext,
  db: DB,
): Promise<PostEntity> {
  if (params.content.length < 1) {
    throw appError(new BadRequest([
      { message: 'content invalid.' },
    ]));
  }
  const post = await PostRepository.create({
    userId: ctx.userId,
    content: params.content,
  }, ctx, db);
  return post;
}

export async function get(
  params: { postId: string },
  ctx: AccessContext,
  db: DB,
): Promise<PostEntity> {
  if (params.postId.length < 1) {
    throw appError(new BadRequest([
      { message: 'postId invalid.' },
    ]));
  }
  const post = await PostRepository.get({
    postId: params.postId
  }, ctx, db);
  if (post == null) {
    throw appError(new ResourceNotFound("Post"));
  }
  return post;
}

export async function remove(
  params: { postId: string },
  ctx: AccessContext,
  db: DB,
): Promise<void> {
  if (params.postId.length < 1) {
    throw appError(new BadRequest([
      { message: 'postId invalid.' },
    ]));
  }

  // 作成者以外は削除できない
  const post = await PostRepository.get({
    postId: params.postId
  }, ctx, db);
  if (post == null) {
    throw appError(new ResourceNotFound("Post"));
  }
  if (post.userId != ctx.userId) {
    throw appError(new AccessDenied());
  }

  const success = await PostRepository.remove({
    postId: params.postId,
  }, ctx, db);
  if (!success) {
    throw appError(new ResourceNotFound("Post"));
  }
}
