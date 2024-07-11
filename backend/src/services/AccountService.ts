import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { DatabaseService } from './DatabaseService';

@injectable()
export class AccountService {
  constructor() {}

  async get(accountId: string, db: DatabaseService) {
    throw new Error('not implement');
  }
}
