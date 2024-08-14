import ejs from 'ejs';
import { glob } from 'glob';
import { inject, injectable } from 'inversify';
import path from 'node:path';
import { AppConfig } from '../app';
import { TYPES } from '../container/types';

/**
 * EJS レンダリング時に置換する変数のキー
 *
 * @todo フロントエンド開発向けのパッケージで提供したいがとりあえずここで定義
 */
interface EjsVariableKeys {
  /**
   * サイトがホストされている URL の origin 部
   *
   * 末尾スラッシュなし
   * @example https://frost.example.com
   */
  origin: string;
  /** サイト名 */
  siteName: string;
  /**
   * リクエストのパス
   *
   * `/` で始まる
   */
  path: string;
}

@injectable()
export class FrontendRenderingService {
  constructor(@inject(TYPES.AppConfig) private readonly config: AppConfig) {}

  /**
   * SPA の index.ejs ファイルをレンダリングして HTML 文字列を返す
   * @param requestPath `/` で始まる
   * @throws config ({@link AppConfig})の `frontendServing` が構成されていない (`undefined`)場合
   */
  async renderSpaIndexEntryEjs(requestPath: string) {
    if (this.config.frontendServing == null) {
      throw new Error('"frontendServing" is not configured');
    }
    if (this.config.frontendServing.ejsRelativePath == null) {
      throw new Error(
        '"frontendServing.indexEjsRelativePath" is not configured',
      );
    }

    const ejsAbsolutePath = path.resolve(
      this.config.frontendServing.staticDirectoryPath,
      this.config.frontendServing.ejsRelativePath,
    );
    return ejs.renderFile(ejsAbsolutePath, {
      origin: this.config.origin,
      siteName: this.config.siteName,
      path: requestPath,
    } satisfies EjsVariableKeys);
  }

  /**
   * TODO: リクエストの度に glob するのはパフォーマンス上良くなさそう (開発中はリクエスト毎に書き変わったほうが便利かも？)\
   *       起動時のみの glob で済ませるためコンストラクターでこれを行ってフィールドにパスの一覧を持ちたいが
   *       非同期プロバイダー的なものを使う必要はあるかも
   */
  getAssetsFilePaths() {
    if (this.config.frontendServing == null) {
      throw new Error('"frontendServing" is not configured');
    }

    return glob(`${this.config.frontendServing.staticDirectoryPath}/**/*`, {
      // 出力パス形式を staticDirectoryPath からの相対パスにする
      absolute: false,
      cwd: this.config.frontendServing.staticDirectoryPath,
    });
  }
}
