# テーブル設計

```mermaid
erDiagram
  Account {
    string id
  }

  User {
    string id
    string accountId
    string name
    string displayName
  }

  UserFollowing {
    string sourceUserId
    string targetUserId
  }

  UserTag {
    string id
    string userId
    string tagName
  }

  Article {
    string id
    string userId
    string chatRoomId
    string visibility
  }
```

```mermaid
erDiagram
  ArticleTag {
    string postId
    string tagName
  }

  ChatRoom {
    string id
    string title
  }

  ChatRoomEnter {
    string chatRoomId
    string userId
  }
```

# ER図

## パスワード認証

```mermaid
erDiagram
  Account {
    string id
    string name
    boolean passwordAuthEnabled
  }

  Account ||--o{ PasswordAuth : ""

  PasswordAuth {
    string id
    string accountId
    string algorithm
    integer salt
    string hash
  }
```

## ユーザープロファイル
アカウントは複数のユーザープロファイルを作成できる。
```mermaid
erDiagram
  Account {
    string id
  }

  Account ||--o{ User : ""

  User {
    string id
    string accountId
    string name
    string displayName
  }
```

## ユーザーのフォロー
ユーザーは他のユーザーをフォローできる。
```mermaid
erDiagram
  User {
    string id
  }

  UserFollowing {
    string id
    string sourceUserId
    string targetUserId
  }

  User ||--o{ UserFollowing : ""
  UserFollowing }o--|| User : ""
```

## ユーザータグ
ユーザーには関心のある物事をタグとして設定できる。
```mermaid
erDiagram
  User {
    string id
  }

  User ||--o{ UserTag : ""

  UserTag {
    string id
    string userId
    string tagId
  }

  UserTag }o--|| Tag : ""

  Tag {
    string id
    string name
  }
```

## タイムラインへの投稿
ユーザーは短い記事を投稿できる。\
記事には公開範囲を設定することができる。
```mermaid
erDiagram
  User {
    string id
  }

  User ||--o{ Article : ""

  Article {
    string id
    string userId
    string visibility
  }

  Article ||--o{ ArticleTag : ""

  ArticleTag {
    string id
    string articleId
    string tagId
  }

  ArticleTag }o--|| Tag : ""

  Tag {
    string id
    string name
  }
```

## チャットルーム
チャットルームに入室して投稿を作成することができます。\
投稿自体はタイムラインの物と共通ですが、こちらはcharRoomIdが入ります。
```mermaid
erDiagram
  User {
    string id
  }

  User ||--o{ ChatRoomEnter : ""

  ChatRoomEnter {
    string id
    string userId
  }

  ChatRoomEnter }|--|| ChatRoom : ""

  ChatRoom {
    string id
  }

  User ||--o{ Article : ""
  ChatRoom |o--o{ Article : ""

  Article {
    string id
    string userId
    string chatRoomId
  }
```
