import { Account } from '../account/account.entity';

export type User = {
  userId: string;
  accounts: Account[];
};
