## DBのマイグレーションを作成する
開発時にDrizzleのスキーマの変更が生じた場合は、\
以下のコマンドを実行してDBのマイグレーションを作成・適用してください。
```
pnpm migration:generate --name [このマイグレーションの名前]
pnpm migration:apply
```

例:
```
pnpm migration:generate --name honi
pnpm migration:apply
```
