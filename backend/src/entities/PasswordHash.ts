import crypto from 'node:crypto';

/**
 * パスワードハッシュ
*/
export class PasswordHash {
  constructor(
    public algorithm: string,
    public salt: string,
    public hash: string
  ) {}

  private static generateSalt(): string {
    // max length: 32
    return crypto.randomBytes(16).toString('hex');
  }

  private static generateHash(algorithm: string, salt: string, password: string): string {
    const cryptoHash = crypto.createHash(algorithm);
    cryptoHash.update(password + salt);
    return cryptoHash.digest('hex');
  }

  /**
   * パスワードからパスワードハッシュを生成します。
  */
  static generate(password: string) {
    const algorithm = 'sha512';
    const salt = PasswordHash.generateSalt();
    const hash = PasswordHash.generateHash(algorithm, salt, password);
    return new PasswordHash(algorithm, salt, hash);
  }

  /**
   * パスワードハッシュを用いてパスワードを検証します。
  */
  verify(password: string) {
    if (this.algorithm == 'sha512') {
      const hash = PasswordHash.generateHash(this.algorithm, this.salt, password);
      return (hash == this.hash);
    }
    throw new Error('unsupported algorithm'); 
  }
}
