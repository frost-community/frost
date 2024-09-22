import { Container } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import { AccessDenied, appError, BadRequest, ResourceNotFound } from "../modules/appErrors";
import { LeafEntity } from "../modules/entities";
import * as LeafRepository from "../repositories/LeafRepository";

/**
 * 投稿を作成します。
*/
export async function createLeaf(
  params: { content: string },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity> {
  if (params.content.length < 1) {
    throw appError(new BadRequest([
      { message: 'content invalid.' },
    ]));
  }
  const post = await LeafRepository.create({
    userId: ctx.userId,
    content: params.content,
  }, ctx, container);
  return post;
}

/**
 * 投稿を取得します。
*/
export async function getLeaf(
  params: { leafId: string },
  ctx: AccessContext,
  container: Container,
): Promise<LeafEntity> {
  if (params.leafId.length < 1) {
    throw appError(new BadRequest([
      { message: 'postId invalid.' },
    ]));
  }
  const post = await LeafRepository.get({
    leafId: params.leafId
  }, ctx, container);
  if (post == null) {
    throw appError(new ResourceNotFound("Leaf"));
  }
  return post;
}

/**
 * 投稿を削除します。
*/
export async function deleteLeaf(
  params: { leafId: string },
  ctx: AccessContext,
  container: Container,
): Promise<void> {
  if (params.leafId.length < 1) {
    throw appError(new BadRequest([
      { message: 'postId invalid.' },
    ]));
  }

  // 作成者以外は削除できない
  const post = await LeafRepository.get({
    leafId: params.leafId
  }, ctx, container);
  if (post == null) {
    throw appError(new ResourceNotFound("Leaf"));
  }
  if (post.userId != ctx.userId) {
    throw appError(new AccessDenied());
  }

  const success = await LeafRepository.remove({
    leafId: params.leafId,
  }, ctx, container);
  if (!success) {
    throw appError(new ResourceNotFound("Leaf"));
  }
}
