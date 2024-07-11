import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { DatabaseService } from './DatabaseService';

@injectable()
export class UserService {
  constructor() {}

  async get(userId: string) {
    throw new Error('not implement');
  }
}
