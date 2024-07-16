import { CharStream } from './stream/char-stream.js';
import { error } from './util/error.js';
import type { Token } from './token.js';
import { TOKEN, TokenKind } from './token.js';
import { SyntaxNode } from './syntax-node.js';

const spaceChars = [' ', '\t'];
const lineBreakChars = ['\r', '\n'];
const digit = /^[0-9]$/;
const wordChar = /^[A-Za-z0-9_]$/;
const spCharTable = new Map([
  //['r', '\r'],
  //['n', '\n'],
  //['t', '\t'],
]);

/**
 * 入力文字列からトークンを読み取るクラス
*/
export class Scanner {
  private stream: CharStream;
  private _tokens: Token[] = [];

  constructor(source: string)
  constructor(stream: CharStream)
  constructor(x: string | CharStream) {
    if (typeof x === "string") {
      this.stream = new CharStream(x);
    } else {
      this.stream = x;
    }
    this._tokens.push(this.readToken());
  }

  /**
   * カーソル位置にあるトークンを取得します。
   */
  public getToken(): Token {
    return this._tokens[0]!;
  }

  /**
   * カーソル位置にあるトークンの種類を取得します。
   */
  public getKind(): TokenKind {
    return this.getToken().kind;
  }

  public when(value: TokenKind | string | string[]): boolean {
    if (typeof value == 'string') {
      return (this.getToken().kind == TokenKind.Identifier && this.getToken().value! == value);
    } else if (Array.isArray(value)) {
      return (this.getToken().kind == TokenKind.Identifier && value.includes(this.getToken().value!));
    } else {
      return (this.getToken().kind == value);
    }
  }

  /**
   * カーソル位置を次のトークンへ進めます。
   */
  public next(): void {
    // 現在のトークンがEOFだったら次のトークンに進まない
    if (this._tokens[0]!.kind === TokenKind.EOF) {
      return;
    }

    this._tokens.shift();

    if (this._tokens.length === 0) {
      this._tokens.push(this.readToken());
    }
  }

  /**
   * トークンの先読みを行います。カーソル位置は移動されません。
   */
  public lookahead(offset: number): Token {
    while (this._tokens.length <= offset) {
      this._tokens.push(this.readToken());
    }

    return this._tokens[offset]!;
  }

  public unexpectedToken(): Error {
    return error(
      `unexpected token: ${TokenKind[this.getKind()]}`,
      this.getToken().loc
    );
  }

  /**
   * カーソル位置にあるトークンが指定したトークンの種類またはキーワードと一致するかを確認します。
   * 一致しなかった場合には文法エラーを発生させます。
   */
  public expect(value: TokenKind | string): void {
    if (typeof value == 'string') {
      if (this.getKind() !== TokenKind.Identifier) {
        throw this.unexpectedToken();
      }
      if (this.getToken().value !== value) {
        throw this.unexpectedToken();
      }
    } else {
      if (this.getKind() !== value) {
        throw this.unexpectedToken();
      }
    }
  }

  public repeat<T extends SyntaxNode>(parseItem: (s: Scanner) => T, terminator: (x: Token) => boolean, separator?: (x: Token) => boolean): T[] {
    const items: T[] = [];

    // 終端のトークンかを確認する
    while (!terminator(this.getToken())) {
      // 2個目の項目以降は、前に区切りトークンがあることを期待する
      if (separator != null && items.length > 0) {
        // 区切りトークンかを確認する
        if (!separator(this.getToken())) {
          throw this.unexpectedToken();
        }

        this.next();
      }

      const item = parseItem(this);
      items.push(item);
    }

    return items;
  }

  /**
   * カーソル位置にあるトークンが指定したトークンの種類と一致することを確認し、
   * カーソル位置を次のトークンへ進めます。
   */
  public nextWith(value: TokenKind | string): void {
    this.expect(value);
    this.next();
  }

  private readToken(): Token {
    let token;

    while (true) {
      if (this.stream.eof) {
        token = TOKEN(TokenKind.EOF, this.stream.getPos(), {});
        break;
      }

      // skip spasing
      if (spaceChars.includes(this.stream.char)) {
        this.stream.next();
        continue;
      }
      if (lineBreakChars.includes(this.stream.char)) {
        this.stream.next();
        continue;
      }

      // store the token position
      const loc = this.stream.getPos();

      switch (this.stream.char) {
        case "=": {
          this.stream.next();
          token = TOKEN(TokenKind.Eq, loc, {});
          break;
        }
        case ':': {
          this.stream.next();
          token = TOKEN(TokenKind.Colon, loc, {});
          break;
        }
        case ';': {
          this.stream.next();
          token = TOKEN(TokenKind.SemiColon, loc, {});
          break;
        }
        case "{": {
          this.stream.next();
          token = TOKEN(TokenKind.OpenBrace, loc, {});
          break;
        }
        case "}": {
          this.stream.next();
          token = TOKEN(TokenKind.CloseBrace, loc, {});
          break;
        }
        case '/': {
          token = this.readEndpointPath();
          break;
        }
        case '"': {
          token = this.readString();
          break;
        }
      }
      if (token == null) {
        const digitToken = this.tryReadDigits();
        if (digitToken) {
          token = digitToken;
          break;
        }
        const wordToken = this.tryReadWord();
        if (wordToken) {
          token = wordToken;
          break;
        }
        throw error(`invalid character: "${this.stream.char}"`, loc);
      }
      break;
    }
    return token;
  }

  private tryReadWord(): Token | undefined {
    // read a word
    let value = "";

    const loc = this.stream.getPos();

    while (!this.stream.eof && wordChar.test(this.stream.char)) {
      value += this.stream.char;
      this.stream.next();
    }
    if (value.length === 0) {
      return;
    }
    // check word kind
    switch (value) {
      case "syntax": {
        return TOKEN(TokenKind.SyntaxKeyword, loc, {});
      }
      default: {
        return TOKEN(TokenKind.Identifier, loc, { value });
      }
    }
  }

  private readEndpointPath(): Token {
    let buf = '';

    const loc = this.stream.getPos();

    buf += this.stream.char;
    this.stream.next();

    // TODO

    return TOKEN(TokenKind.EndpointPath, loc, { value: buf });
  }

  private readString(): Token {
    let buf = "";

    const loc = this.stream.getPos();

    // consume the open
    this.stream.next();

    while (true) {
      if (this.stream.eof) {
        throw new Error("unexpected EOF");
      }
      if (this.stream.char == '"') {
        this.stream.next();
        break;
      }
      if (this.stream.char == "\\") {
        this.stream.next();
        // special character
        if (this.stream.eof) {
          throw new Error("unexpected EOF");
        }
        const sc = spCharTable.get(this.stream.char);
        if (sc == null) {
          throw new Error("invalid special character");
        }
        buf += sc;
        this.stream.next();
        continue;
      }
      buf += this.stream.char;
      this.stream.next();
    }

    return TOKEN(TokenKind.StringLiteral, loc, { value: buf });
  }

  private tryReadDigits(): Token | undefined {
    let wholeNumber = "";
    let fractional = "";

    const loc = this.stream.getPos();

    while (!this.stream.eof && digit.test(this.stream.char)) {
      wholeNumber += this.stream.char;
      this.stream.next();
    }
    if (wholeNumber.length === 0) {
      return;
    }
    if (!this.stream.eof && this.stream.char === ".") {
      this.stream.next();
      while ((!this.stream.eof as boolean) && digit.test(this.stream.char as string)) {
        fractional += this.stream.char;
        this.stream.next();
      }
      if (fractional.length === 0) {
        throw error("digit expected", loc);
      }
    }
    let value;
    if (fractional.length > 0) {
      value = wholeNumber + "." + fractional;
    } else {
      value = wholeNumber;
    }
    return TOKEN(TokenKind.NumberLiteral, loc, { value });
  }
}
