import { inject, injectable } from "inversify";
import { TYPES } from "../container/types";
import { appError, InvalidParam, PostNotFound } from "../modules/apiErrors";
import { PostRepository } from "../repositories/PostRepository";
import { AccessContext } from "../types/access-context";
import { PostEntity } from "../types/entities";

@injectable()
export class PostService {
  constructor(
    @inject(TYPES.PostRepository) private readonly postRepository: PostRepository,
  ) {}

  async createTimelinePost(params: { content: string }, ctx: AccessContext): Promise<PostEntity> {
    if (params.content.length < 1) {
      throw appError(new InvalidParam([]));
    }
    const post = await this.postRepository.create({
      userId: ctx.userId,
      content: params.content,
    }, ctx);
    return post;
  }

  async get(params: { postId: string }, ctx: AccessContext): Promise<PostEntity> {
    if (params.postId.length < 1) {
      throw appError(new InvalidParam([]));
    }
    const post = await this.postRepository.get({
      postId: params.postId
    }, ctx);
    if (post == null) {
      throw appError(new PostNotFound());
    }
    return post;
  }

  async delete(params: { postId: string }, ctx: AccessContext): Promise<void> {
    if (params.postId.length < 1) {
      throw appError(new InvalidParam([]));
    }
    const success = await this.postRepository.delete({
      postId: params.postId,
    }, ctx);
    if (!success) {
      throw appError(new PostNotFound());
    }
  }
}
