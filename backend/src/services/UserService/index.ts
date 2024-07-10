import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { DatabaseService } from '../DatabaseService';

@injectable()
export class UserService {
  constructor() {}

  async get(userId: string, db: DatabaseService) {
    throw new Error('not implement');
  }
}
