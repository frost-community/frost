# お約束

## ルーティング関係

ドキュメント: https://tanstack.com/router/latest/docs/framework/react/overview

- ページのファイルは`route.tsx`か`route.lazy.tsx`とし、`createFileRoute`か`createLazyFileRoute`を使って`Route`コンポーネントをエクスポートする
  - lazyで使う場合はlazyを使う
- ルートを出力しないファイル・フォルダーに関してはファイル先頭に`-`を付ける(`-components/`)など
- 型定義ファイルを出力するために、`pnpm dev`のほかに`pnpm generate-routes`もしくは`pnpm watch-routes`コマンドを実行する
- `__root.tsx`はすべてのルートで適用されます

## UIコンポーネントライブラリ関係

ドキュメント: https://mantine.dev/core/stack/

- 基本的にスタイリングは[Style Props](https://mantine.dev/styles/style-props/)を使う
  - Style Propsで間に合わない場合は[style prop](https://mantine.dev/styles/style/)を使う
