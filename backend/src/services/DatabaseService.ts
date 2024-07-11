import { drizzle } from 'drizzle-orm/node-postgres';
import { Container, inject, injectable } from 'inversify';
import { Pool } from 'pg';
import * as schema from '../database/schema';
import { TYPES } from '../container/types';

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
