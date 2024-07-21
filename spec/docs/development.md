## tspのバージョン表示
```
pnpm exec tsp --version
```

## リビルド
```
pnpm run rebuild
```
`tsp-output/@typespec/openapi3`ディレクトリに.yamlファイルが生成される。

このファイルを元に全体または部分的に`generated`ディレクトリの.yamlファイルを更新する。
すべて置き換える場合は、以下のコマンドでも`generated`ディレクトリに.yamlファイルをコピーできる。
```
pnpm run apply
```

## 依存関係のインストール
```
pnpm i
```
`tsp install`は使用しないこと！
