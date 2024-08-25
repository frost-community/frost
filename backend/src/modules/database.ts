import { drizzle, NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgDatabase } from "drizzle-orm/pg-core";
import { Pool, PoolClient } from "pg";
import { AppConfig } from "../app";
import * as schema from "../database/schema";

export class ConnectionPool {
  private pool: Pool;

  constructor(
    config: AppConfig,
  ) {
    this.pool = new Pool({
      connectionString: config.db.connectionString,
      max: config.db.maxPool ?? 10,
    });
  }

  /**
   * データベースのコネクションを取得します。
  */
  async acquire() {
    const internalClient = await this.pool.connect();
    return new ConnectionLayers(internalClient);
  }

  /**
   * コネクションプールを破棄します。
  */
  async dispose() {
    return this.pool.end();
  }
}

export class ConnectionLayers {
  /**
   * コネクションを保持する配列。
   * 
   * インデックス0は常に現在アクティブなコネクションを表します。\
   * ちなみにトランザクションもコネクションの1つです。\
   * 新しいコネクション(以降、サブコネクションと呼びます)が生成されるとインデックス0の位置に挿入され、現在のコネクションがサブコネクションに切り替わります。\
   * サブコネクションが破棄される時はサブコネクションはコレクションから削除され、\
   * サブコネクションが生成される前のコネクションに切り替わります。
  */
  private layers: PgDatabase<NodePgQueryResultHKT, typeof schema>[] = [];

  private internalClient: PoolClient;

  constructor(internalClient: PoolClient) {
    this.internalClient = internalClient;
    const connection = drizzle(internalClient, { schema });
    this.layers.push(connection);
  }

  /**
   * 現在のコネクションを取得します。
  */
  getCurrent(): PgDatabase<NodePgQueryResultHKT, typeof schema> {
    return this.layers[0]!;
  }

  /**
   * トランザクション内で指定されたアクションを実行します。
  */
  async execAction<T>(action: () => Promise<T>): Promise<T> {
    const db = this.getCurrent();
    return db.transaction(async (tx) => {
      this.layers.unshift(tx);
      const returnValue = await action();
      this.layers.shift();
      return returnValue;
    });
  }

  /**
   * データベース接続を開放します。
  */
  dispose() {
    this.internalClient.release();
  }
}
