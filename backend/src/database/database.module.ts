import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import * as postgres from 'pg';

export class Database {
  constructor(public client: postgres.Client, public db: NodePgDatabase) {}

  static async connect() {
    // connect db
    const client = new postgres.Client('postgres://postgres:postgres@localhost:5432/frost');
    await client.connect();

    // wrap db with drizzle
    const db = drizzle(client);

    return new Database(client, db);
  }
}
