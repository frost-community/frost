import { env as nodeEnv } from 'node:process';

// Utilities
/**
 * Non-nullish な値を期待する
 * @returns - `value` 引数が `null` でも `undefined` でもない場合: `value` 引数
 *          - そうでない場合: `elseProvider` 引数を実行した返り値
 */
const requireOr = <E, T /* 🌕🚲👉👈 */>(elseProvider: () => E, value: T) =>
  value == null ? elseProvider() : value;
/**
 * 数値表現を期待する
 * @returns - `value` 引数が 数値表現の場合: `value` 引数を `number` として解釈したもの
 *          - そうでない場合: `elseProvider` 引数を実行した返り値
 */
const numberOr = <E>(elseProvider: () => E, text: string) => {
  const parsed = Number.parseFloat(text);
  if (Number.isNaN(parsed)) {
    return elseProvider();
  }
  return parsed;
};
/**
 * 選択肢のうちのどれかを期待する
 * @returns - `value` 引数が `options` 引数のうちのどれかの場合 : `value` 引数
 *          - そうでない場合: `elseProvider` 引数を実行した返り値
 */
const choosenValueOr = <E, O extends Readonly<unknown[]>>(
  elseProvider: () => E,
  options: O,
  value: unknown,
) => (!options.includes(value) ? elseProvider() : (value as O[number]));
/**
 * 正規表現にマッチする文字列を期待する
 * @returns - `text` 引数が `regexp` 引数にマッチする場合 : `text` 引数
 *          - そうでない場合: `elseProvider` 引数を実行した返り値
 */
const matchedTextOr = <E>(
  elseProvider: () => E,
  regexp: RegExp,
  text: string,
) => {
  const match = regexp.exec(text);
  if (match === null) {
    return elseProvider();
  }
  return match[0];
};
/**
 * エラーを throw する関数を返す
 *
 * 関数名に反して Provider であることに注意
 * @param kind エラーメッセージの種類
 * @param values エラーメッセージに用いられる値
 * @returns エラーを throw する関数
 */
const throwBy =
  <K extends 'NOT_SET' | 'NOT_NUMBER'>(
    kind: K,
    values: K extends 'NOT_SET'
      ? { variableName: string }
      : K extends 'NOT_NUMBER'
        ? { variableName: string }
        : never,
  ) =>
  () => {
    switch (kind) {
      case 'NOT_SET':
        throw new Error(
          `The environment variable '${values.variableName}' is not set`,
        );
      case 'NOT_NUMBER':
        throw new Error(
          `The environment variable '${values.variableName}' must be a number`,
        );
      default:
        throw new Error(`Unknown kind ${kind}`); // どなた!? (正しく実装されていればここには来ない)
    }
  };

/** Typed environment variables */
export const env = {
  PORT: numberOr(
    throwBy('NOT_NUMBER', { variableName: 'PORT' }),
    requireOr(throwBy('NOT_SET', { variableName: 'PORT' }), nodeEnv.PORT),
  ),
  ENV: choosenValueOr(
    throwBy('NOT_NUMBER', { variableName: 'ENV' }),
    ['production', 'development'] as const,
    requireOr(throwBy('NOT_SET', { variableName: 'ENV' }), nodeEnv.ENV),
  ),
};
