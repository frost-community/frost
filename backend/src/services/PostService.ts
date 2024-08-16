import { eq } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { Database } from './DatabaseService';
import { Post } from '../database/schema';
import { createError, PostNotFound } from '../modules/service-error';
import { PostEntity } from '../modules/entities';

@injectable()
export class PostService {
  constructor(
  ) {}

  async create(params: { userId: string, chatRoomId?: string, content: string }, db: Database): Promise<PostEntity> {
    const rows = await db.getConnection()
      .insert(
        Post
      )
      .values({
        chatRoomId: params.chatRoomId,
        userId: params.userId,
        content: params.content,
      })
      .returning();
    const row = rows[0]!;

    const post = {
      postId: row.postId,
      chatRoomId: row.chatRoomId ?? undefined,
      userId: row.userId,
      content: row.content,
    };
    return post;
  }

  async get(params: { postId: string }, db: Database): Promise<PostEntity> {
    const rows = await db.getConnection()
      .select({
        postId: Post.postId,
        chatRoomId: Post.chatRoomId,
        userId: Post.userId,
        content: Post.content,
      })
      .from(
        Post
      )
      .where(
        eq(Post.postId, params.postId)
      );

    if (rows.length == 0) {
      throw createError(new PostNotFound({ postId: params.postId }));
    }
    const row = rows[0]!;

    const post = {
      postId: row.postId,
      chatRoomId: row.chatRoomId ?? undefined,
      userId: row.userId,
      content: row.content,
    };
    return post;
  }

  async delete(params: { postId: string }, db: Database): Promise<void> {
    const rows = await db.getConnection()
      .delete(
        Post
      )
      .where(
        eq(Post.postId, params.postId)
      );

    if (rows.rowCount == 0) {
      throw createError(new PostNotFound({ postId: params.postId }));
    }
  }
}
