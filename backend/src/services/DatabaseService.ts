import { drizzle, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { Container, inject, injectable } from 'inversify';
import { Pool } from 'pg';
import * as schema from '../database/schema';
import { TYPES } from '../container/types';
import { PgDatabase } from 'drizzle-orm/pg-core';

@injectable()
export class DatabaseService {
  /**
   * コネクションを保持する配列。
   * 
   * インデックス0は常に現在アクティブなコネクションを表します。\
   * ちなみにトランザクションもコネクションの1つです。\
   * 新しいコネクション(以降、サブコネクションと呼びます)が生成されるとインデックス0の位置に挿入され、現在のコネクションがサブコネクションに切り替わります。\
   * サブコネクションが破棄される時はサブコネクションはコレクションから削除され、\
   * サブコネクションが生成される前のコネクションに切り替わります。
  */
  #connectionLayers: PgDatabase<NodePgQueryResultHKT, typeof schema>[] = [];

  constructor() {}

  /**
   * データベースに接続します。
  */
  async connect() {
    if (this.isConnected()) {
      throw new Error('It is already connected to the database');
    }

    const pg = new Pool({
      connectionString: 'postgresql://postgres:postgres@db:5432/frost',
      max: 10,
    });
    await pg.connect();

    const db = drizzle(pg, { schema });
    this.#connectionLayers.push(db);
  }

  /**
   * データベースへ接続されているかどうかを取得します。
  */
  isConnected(): boolean {
    return (this.#connectionLayers.length > 0);
  }

  /**
   * 現在のデータベース接続またはトランザクションを取得します。
  */
  getConnection(): PgDatabase<NodePgQueryResultHKT, typeof schema> {
    if (!this.isConnected()) {
      throw new Error('It is not connected to the database');
    }
    return this.#connectionLayers[0]!;
  }

  /**
   * トランザクション内で指定されたアクションを実行します。
  */
  async transaction<T>(action: () => Promise<T>): Promise<T> {
    return this.getConnection().transaction(async (tx) => {
      this.#connectionLayers.unshift(tx);
      const returnValue = await action();
      this.#connectionLayers.shift();
      return returnValue;
    });
  }
}
