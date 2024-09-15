# APIリファレンス (v1)

# auth ネームスペース

## signup
```
POST /api/v1/auth/signup
```
アカウントのサインアップ。\
この操作はアクセストークンを発行する。

### body
TODO



## signin
```
POST /api/v1/auth/signin
```
アカウントのサインイン。\
この操作はアクセストークンを発行する。

### body
TODO



# user ネームスペース

## getUser
```
GET /api/v1/user/getUser
```
ユーザー情報を取得する。

### query string
- userId (optional)
- username (optional)



## searchUsers
```
GET /api/v1/user/searchUsers
```
ユーザー情報を検索する。

### query string
TODO



## deleteUser
```
POST /api/v1/user/deleteUser
```
ユーザー情報を削除する。

### body
- userId



## getFollowings
```
GET /api/v1/user/getFollowings
```
指定したユーザーのフォロー一覧を取得する。

### query string
- userId
- nextCursor (optional)



## followUser
```
POST /api/v1/user/followUser
```
ユーザーをフォローする。

### body
- userId



## unfollowUser
```
POST /api/v1/user/unfollowUser
```
ユーザーをフォロー解除する。

### body
- userId



## getHomeTimeline
```
GET /api/v1/user/getHomeTimeline
```
ホームタイムラインを取得する。

### query string
- nextCursor (optional)
- prevCursor (optional)



# leaf ネームスペース

## createLeaf
```
POST /api/v1/leaf/createLeaf
```
リーフを投稿する。

### body
- content



## getLeaf
```
GET /api/v1/leaf/getLeaf
```
リーフを取得する。

### query string
- leafId



## searchLeafs
```
GET /api/v1/leaf/searchLeafs
```
リーフを検索する。

### query string
TODO



## deleteLeaf
```
POST /api/v1/leaf/deleteLeaf
```
リーフを削除する。

### body
- leafId



# chatroom ネームスペース

## createChatroom
```
POST /api/v1/chatroom/createChatroom
```
チャットルームを作成する。

### body
- title
- description



## getChatroom
```
GET /api/v1/chatroom/getChatroom
```
リーフを取得する。

### query string
- chatroomId



## searchChatrooms
```
GET /api/v1/chatroom/searchChatrooms
```
チャットルームを検索する。

### query string
TODO



## deleteChatroom
```
POST /api/v1/chatroom/deleteChatroom
```
チャットルームを削除する。

### body
- chatroomId



## createLeaf
```
POST /api/v1/chatroom/createLeaf
```
チャットルームにリーフを投稿する。

### body
- chatroomId
- content



## getTimeline
```
GET /api/v1/chatroom/getTimeline
```
チャットルームのタイムラインを取得する。\
リーフの取得や削除、検索に関してはleafネームスペースのAPIを利用する。

### query string
- chatroomId
- nextCursor (optional)
- prevCursor (optional)
