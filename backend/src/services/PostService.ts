import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { AccessDenied, appError, BadRequest, ResourceNotFound } from "../modules/appErrors";
import { PostRepository } from "../repositories/PostRepository";
import { AccessContext } from "../types/access-context";
import { PostEntity } from "../types/entities";

@injectable()
export class PostService {
  constructor(
    @inject(TYPES.PostRepository) private readonly postRepository: PostRepository,
  ) {}

  public async createTimelinePost(params: { content: string }, ctx: AccessContext): Promise<PostEntity> {
    if (params.content.length < 1) {
      throw appError(new BadRequest([
        { message: 'content invalid.' },
      ]));
    }
    const post = await this.postRepository.create({
      userId: ctx.userId,
      content: params.content,
    }, ctx);
    return post;
  }

  public async get(params: { postId: string }, ctx: AccessContext): Promise<PostEntity> {
    if (params.postId.length < 1) {
      throw appError(new BadRequest([
        { message: 'postId invalid.' },
      ]));
    }
    const post = await this.postRepository.get({
      postId: params.postId
    }, ctx);
    if (post == null) {
      throw appError(new ResourceNotFound("Post"));
    }
    return post;
  }

  public async delete(params: { postId: string }, ctx: AccessContext): Promise<void> {
    if (params.postId.length < 1) {
      throw appError(new BadRequest([
        { message: 'postId invalid.' },
      ]));
    }

    // 作成者以外は削除できない
    const post = await this.postRepository.get({
      postId: params.postId
    }, ctx);
    if (post == null) {
      throw appError(new ResourceNotFound("Post"));
    }
    if (post.userId != ctx.userId) {
      throw appError(new AccessDenied());
    }

    const success = await this.postRepository.delete({
      postId: params.postId,
    }, ctx);
    if (!success) {
      throw appError(new ResourceNotFound("Post"));
    }
  }
}
