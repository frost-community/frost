import { Container } from "inversify";
import { TokenEntity, UserEntity } from "../../src/modules/entities";
import * as UserRepository from "../../src/repositories/UserRepository";
import * as PasswordVerificationService from "../../src/services/PasswordVerificationService";
import * as TokenService from "../../src/services/TokenService";
import * as UserService from "../../src/services/UserService";

describe('UserService', () => {

  describe('signup', () => {
    function setMock() {
      UserRepository.create = jest.fn<Promise<UserEntity>, []>()
        .mockReturnValue(
          Promise.resolve({
            userId: '',
            name: '',
            displayName: '',
            passwordAuthEnabled: true,
          } as UserEntity)
        );

      PasswordVerificationService.create = jest.fn<Promise<void>, []>()
        .mockReturnValue(Promise.resolve());

      TokenService.create = jest.fn<Promise<TokenEntity>, []>()
        .mockReturnValue(
          Promise.resolve({
            token: '',
            scopes: [],
          } as TokenEntity)
        );
    }
    it('正常にユーザーを作成できる', () => {
      const container = new Container();

      setMock();


    });
  });

});
