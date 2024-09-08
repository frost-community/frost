import { Container } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import { AccessDenied, appError, BadRequest, ResourceNotFound } from "../modules/appErrors";
import { PostEntity } from "../modules/entities";
import * as PostRepository from "../repositories/PostRepository";

/**
 * 投稿を作成します。
*/
export async function createTimelinePost(
  params: { content: string },
  ctx: AccessContext,
  container: Container,
): Promise<PostEntity> {
  if (params.content.length < 1) {
    throw appError(new BadRequest([
      { message: 'content invalid.' },
    ]));
  }
  const post = await PostRepository.create({
    userId: ctx.userId,
    content: params.content,
  }, ctx, container);
  return post;
}

/**
 * 投稿を取得します。
*/
export async function get(
  params: { postId: string },
  ctx: AccessContext,
  container: Container,
): Promise<PostEntity> {
  if (params.postId.length < 1) {
    throw appError(new BadRequest([
      { message: 'postId invalid.' },
    ]));
  }
  const post = await PostRepository.get({
    postId: params.postId
  }, ctx, container);
  if (post == null) {
    throw appError(new ResourceNotFound("Post"));
  }
  return post;
}

/**
 * 投稿を削除します。
*/
export async function remove(
  params: { postId: string },
  ctx: AccessContext,
  container: Container,
): Promise<void> {
  if (params.postId.length < 1) {
    throw appError(new BadRequest([
      { message: 'postId invalid.' },
    ]));
  }

  // 作成者以外は削除できない
  const post = await PostRepository.get({
    postId: params.postId
  }, ctx, container);
  if (post == null) {
    throw appError(new ResourceNotFound("Post"));
  }
  if (post.userId != ctx.userId) {
    throw appError(new AccessDenied());
  }

  const success = await PostRepository.remove({
    postId: params.postId,
  }, ctx, container);
  if (!success) {
    throw appError(new ResourceNotFound("Post"));
  }
}
