import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { DatabaseService } from './DatabaseService';

@injectable()
export class PasswordAuthService {
  constructor() {}
}
