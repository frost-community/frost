import { UserEntity } from './UserEntity';

/**
 * ログインアカウント
*/
export type AccountEntity = {
  accountId: string,
  name: string,
  passwordAuthEnabled: boolean,
  users: UserEntity[],
};
