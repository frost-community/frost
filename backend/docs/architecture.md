# アーキテクチャ
Frost Backendで採用するアーキテクチャについて

## 技術選定
- 言語: TypeScript(Node.js)
- フレームワーク: Nest.js
- データベース: PostgreSQL
- ORMライブラリ: Dizzle
- テンプレートエンジン: EJS

## フォルダ構成

### entities
APIが返すオブジェクトの型を定義します。
この型はデータベースのカラム構成と一致するとは限りません。
