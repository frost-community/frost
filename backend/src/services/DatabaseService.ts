import { drizzle, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { Container, inject, injectable } from 'inversify';
import { Pool, PoolClient } from 'pg';
import * as schema from '../database/schema';
import { TYPES } from '../container/types';
import { PgDatabase } from 'drizzle-orm/pg-core';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { AppConfig } from '../app';

export class DatabaseService {
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
    return new Database(internalClient);
  }
}

export class Database {
  /**
   * コネクションを保持する配列。
   * 
   * インデックス0は常に現在アクティブなコネクションを表します。\
   * ちなみにトランザクションもコネクションの1つです。\
   * 新しいコネクション(以降、サブコネクションと呼びます)が生成されるとインデックス0の位置に挿入され、現在のコネクションがサブコネクションに切り替わります。\
   * サブコネクションが破棄される時はサブコネクションはコレクションから削除され、\
   * サブコネクションが生成される前のコネクションに切り替わります。
  */
  private connectionLayers: PgDatabase<NodePgQueryResultHKT, typeof schema>[] = [];

  private internalClient: PoolClient;

  constructor(internalClient: PoolClient) {
    this.internalClient = internalClient;
    const connection = drizzle(internalClient, { schema });
    this.connectionLayers.push(connection);
  }

  /**
   * データベースへ接続されているかどうかを取得します。
  */
  isConnected(): boolean {
    return (this.connectionLayers.length > 0);
  }

  /**
   * 現在のデータベース接続またはトランザクションを取得します。
  */
  getConnection(): PgDatabase<NodePgQueryResultHKT, typeof schema> {
    if (!this.isConnected()) {
      throw new Error('It is not connected to the database');
    }
    return this.connectionLayers[0]!;
  }

  /**
   * トランザクション内で指定されたアクションを実行します。
  */
  async transaction<T>(action: (tx: PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>) => Promise<T>): Promise<T> {
    return this.getConnection()
      .transaction(async (tx) => {
        this.connectionLayers.unshift(tx);
        const returnValue = await action(tx);
        this.connectionLayers.shift();
        return returnValue;
      });
  }

  release() {
    this.internalClient.release();
  }
}
