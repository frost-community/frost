import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { injectable } from 'inversify';

@injectable()
export class DatabaseService {
  constructor() {}

  async connect() {
    const client = new Pool({
      connectionString: 'postgresql://postgres:postgres@db:5432/frost',
      max: 10,
    });
    await client.connect();
    const db = drizzle(client, { schema });
    return db;
  }
}
