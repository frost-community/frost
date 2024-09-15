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

## GET /api/v1/users/:userId/setting/notification
ユーザーの通知設定を取得する
### タグ
`user`

## PATCH /api/v1/users/:userId/setting/notification
ユーザーの通知設定を変更します。
### タグ
`user`

## POST /api/v1/users/:userId/userFollowings
指定されたユーザーをフォローする。
### タグ
`user`

## GET /api/v1/users/:userId/userFollowings
フォローしてるユーザーの一覧を取得する。
### タグ
`user`

## GET /api/v1/users/:userId/timelines/home
ホームタイムラインを取得する。
### タグ
`user` `timeline`

## GET /api/v1/users/:userId/notifications
通知をリストで取得する。
### タグ
`user` `notification`

## POST /api/v1/users/:userId/notifications/markRead
指定された通知を既読にする。
### タグ
`user` `notification`

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
チャットルームを作成する。\
作成したユーザーはそのチャットルームのownerになる。
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
チャットルームを削除する。\
この操作はownerのみ可能。
### タグ
`chatroom`

## POST /api/v1/chatrooms/:chatroomId/leafs
チャットルームへ投稿する。\
投稿の取得や削除、検索に関しては投稿APIを利用する。
### タグ
`chatroom` `leaf`

## GET /api/v1/chatrooms/:chatroomId/timeline
チャットルームのタイムラインを取得する。
### タグ
`chatroom` `leaf`
