# 開発環境
Frost開発環境についてのもろもろ。

## VS Code拡張機能を追加する
Frost開発者全員に使わせていきたいVS Code拡張機能を導入する場合は\
`development/devcontainer.json`および`test/devcontainer.json`に拡張機能IDを追記しコミットしてください。

ℹ️拡張機能横の「管理 (⚙)」ドロップダウンメニュー「devcontainer.jsonに追加」の操作により`devcontainer.json`に拡張機能IDが追記されます。

## Docker composeの設定ファイルはリポジトリ直下に置く
Docker composeは最初に読み込まれた設定ファイルのディレクトリを相対パスのベースとして使用するようです。  
ベースパスを分かりやすくするため、このプロジェクトではリポジトリの直下にDocker composeの設定ファイルを配置することに決めます。

https://github.com/docker/compose/issues/3874

## pgAdminの使い方
pgAdminへの接続
- URL: localhost:5678
- email: postgres@example.com
- password: postgres

以下の内容でサーバー情報を追加
- Name: frost-db
- host: db
- port: 5432
- Maintenance database: frost
- Username: postgres
- password: postgres
