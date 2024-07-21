## API仕様の変更について
TypeSpecでAPI仕様を記述し、その内容からopenapi.yamlを生成する。

## TypeSpecでopenapi.yamlを生成する
```
pnpm run rebuild
```
`generated`ディレクトリに.yamlファイルが生成される。

## TypeSpecのライブラリインストール
devDependenciesに追加するライブラリを記載。
```
pnpm i
```
⚠️`tsp install`は使用しないこと！
