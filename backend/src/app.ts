import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './container/types';
import { DatabaseService } from './services/DatabaseService';
import { HttpServerService } from './services/HttpServerService';

export type AppConfig = {
  port: number;
  env: 'development' | 'production' | 'test';
  /**
   * サイトがホストされる URL の origin 部
   *
   * 末尾スラッシュなし
   * @example https://frost.example.com
   */
  origin: string;
  siteName: string;
  /** バックエンドでフロントエンドのアセット群を配信する場合は指定 */
  frontendServing?: {
    /** 末尾スラッシュなし */
    staticDirectoryPath: string;
    /**
     * EJS としてレンダリングさせてから配信するファイルを指定
     *
     * `staticDirectoryPath` からの相対パス
     */
    ejsRelativePath?: string;
  };
};

@injectable()
export class App {
  constructor(
    @inject(TYPES.HttpServerService) private readonly http: HttpServerService,
    @inject(TYPES.DatabaseService) private readonly db: DatabaseService,
  ) {}

  async run(): Promise<void> {
    await this.db.connect();
    await this.http.listen();
  }
}
