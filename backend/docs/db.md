# テーブル設計

```mermaid
erDiagram
  user {
    string user_id
    string name
    string display_name
    bool password_auth_enabled
    datetime created_at
  }

  password_verification {
    string password_verification_id
    string user_id
    string algorithm
    string salt
    number iteration
    string hash
  }

  token {
    string token_id
    string token_kind
    string user_id
    string token
    datetime expires
    datetime created_at
  }

  token_scope {
    string token_scope_id
    string token_id
    string scope_name
  }
```

```mermaid
erDiagram
  user_following {
    string source_user_id
    string target_user_id
  }

  user_tag {
    string user_tag_id
    string user_id
    string tag_name
  }

  leaf {
    string leaf_id
    string chat_room_id
    string user_id
    string visibility
    string content
    datetime created_at
  }

  leaf_tag {
    string leaf_tag_id
    string leaf_id
    string tag_name
  }
```

```mermaid
erDiagram
  chat_room {
    string chat_room_id
    string title
  }

  chat_room_member {
    string chat_room_id
    string user_id
  }
```

# ER図

## パスワード認証
ユーザーには基本的に1つのパスワードが設定される。
他の認証方法がある場合やサインインできない特殊なユーザーでは設定されない可能性がある。
```mermaid
erDiagram
  user {
    string user_id
    string name
    string display_name
    bool password_auth_enabled
    datetime created_at
  }

  user ||--o| password_verification : ""

  password_verification {
    string password_verification_id
    string user_id
    string algorithm
    string salt
    number iteration
    string hash
  }
```

## ユーザーのフォロー
ユーザーは他のユーザーをフォローできる。\
多対多の関係を中間テーブルで保持する。
```mermaid
erDiagram
  user {
    string user_id
    string name
    string display_name
    bool password_auth_enabled
    datetime created_at
  }

  user ||--o{ user_following : ""
  user_following }o--|| user : ""

  user_following {
    string source_user_id
    string target_user_id
  }
```

## ユーザータグ
ユーザーには関心のある物事をタグとして設定できる。
```mermaid
erDiagram
  user {
    string user_id
    string name
    string display_name
    bool password_auth_enabled
    datetime created_at
  }

  user ||--o{ user_tag : ""

  user_tag {
    string user_tag_id
    string user_id
    string tag_name
  }
```

## タイムラインへの投稿
ユーザーは短い記事を投稿できる。\
記事には公開範囲を設定することができる。
```mermaid
erDiagram
  user {
    string user_id
    string name
    string display_name
    bool password_auth_enabled
    datetime created_at
  }

  user ||--o{ leaf : ""

  leaf {
    string leaf_id
    string user_id
    string visibility
    string content
    datetime created_at
  }

  leaf ||--o{ leaf_tag : ""

  leaf_tag {
    string leaf_tag_id
    string leaf_id
    string tag_name
  }
```

## チャットルーム
チャットルームに入室して投稿を作成することができます。\
投稿自体はタイムラインの物と共通ですが、こちらはcharRoomIdが入ります。
```mermaid
erDiagram
  user {
    string user_id
    string name
    string display_name
    bool password_auth_enabled
    datetime created_at
  }

  user ||--o{ chat_room_member : ""

  chat_room_member {
    string chat_room_id
    string user_id
  }

  chat_room_member }o--|| chat_room : ""

  chat_room {
    string chat_room_id
    string title
  }

  user ||--o{ leaf : ""
  chat_room ||--o{ leaf : ""

  leaf {
    string leaf_id
    string chat_room_id
    string user_id
    string visibility
    string content
    datetime created_at
  }
```
