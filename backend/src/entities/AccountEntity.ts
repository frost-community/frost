import { UserEntity } from './UserEntity';

export class AccountEntity {
  constructor(
    public accountId: string,
    public name: string,
    public passwordAuthEnabled: boolean,
    public users: UserEntity[]
  ) {}
}
