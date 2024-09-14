# APIリファレンス (v1)

## POST /api/v1/signup
アカウントのサインアップ。\
この操作はアクセストークンを発行する。
### タグ
`user` `auth`

## POST /api/v1/signin
アカウントのサインイン。\
この操作はアクセストークンを発行する。
### タグ
`user` `auth`

## GET /api/v1/users/:userId
ユーザー情報を取得する。
### タグ
`user`

## DELETE /api/v1/users/:userId
ユーザー情報を削除する
### タグ
`user`

## GET /api/v1/users/:userId/timeline
ユーザーのタイムラインを取得する。
### タグ
`user` `leaf`

## GET /api/v1/users/:userId/home/timeline
ユーザーのホームタイムラインを取得する。
### タグ
`user` `leaf`

## POST /api/v1/leafs
タイムラインへ投稿する。
### タグ
`leaf`

## GET /api/v1/leafs
投稿データを検索する。
### タグ
`leaf`

## GET /api/v1/leafs/:leafId
投稿データを取得する。
### タグ
`leaf`

## DELETE /api/v1/leafs/:leafId
投稿データを削除する。
### タグ
`leaf`

## POST /api/v1/chatrooms
チャットルームを作成する。
### タグ
`chatroom`

## GET /api/v1/chatrooms
チャットルームを検索する。
### タグ
`chatroom`

## GET /api/v1/chatrooms/:chatroomId
チャットルームの情報を取得する。
### タグ
`chatroom`

## DELETE /api/v1/chatrooms/:chatroomId
チャットルームを削除する。
### タグ
`chatroom`

## POST /api/v1/chatrooms/:chatroomId/enter
チャットルームに入室する。
### タグ
`chatroom` `user`

## POST /api/v1/chatrooms/:chatroomId/leave
チャットルームから退出する。
### タグ
`chatroom` `user`

## GET /api/v1/chatrooms/:chatroomId/members
チャットルームの参加者を検索する。
### タグ
`chatroom` `user`

## POST /api/v1/chatrooms/:chatroomId/leafs
チャットルームへ投稿する。\
投稿の取得や削除、検索に関しては投稿APIを利用する。
### タグ
`chatroom` `leaf`

## GET /api/v1/chatrooms/:chatroomId/timeline
チャットルームのタイムラインを取得する。
### タグ
`chatroom` `leaf`
