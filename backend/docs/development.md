## DBのマイグレーションを作成する
開発時にDBのスキーマ(Prisma Schema)の変更が生じた場合は、\
以下のコマンドを実行してDBのマイグレーションを作成してください。
```
prisma migrate dev --name [このマイグレーションの名前]
```

例:
```
prisma migrate dev --name nice-migration
```
