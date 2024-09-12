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

## GET /api/v1/user/:userId
ユーザー情報を取得する。
### タグ
`user`

## DELETE /api/v1/user/:userId
ユーザー情報を削除する
### タグ
`user`

## GET /api/v1/user/:userId/user-timeline
ユーザーのタイムラインを取得する。
### タグ
`user` `post`

## GET /api/v1/user/:userId/home-timeline
ユーザーのホームタイムラインを取得する。
### タグ
`user` `post`

## POST /api/v1/post
タイムラインへ投稿する。
### タグ
`post`

## GET /api/v1/post/:postId
投稿データを取得する。
### タグ
`post`

## DELETE /api/v1/post/:postId
投稿データを削除する。
### タグ
`post`

## POST /api/v1/post/search
投稿データを検索する。
### タグ
`post`

## POST /api/v1/chatroom
チャットルームを作成する。
### タグ
`chatroom`

## GET /api/v1/chatroom/:chatroomId
チャットルームの情報を取得する。
### タグ
`chatroom`

## DELETE /api/v1/chatroom/:chatroomId
チャットルームを削除する。
### タグ
`chatroom`

## POST /api/v1/chatroom/:chatroomId/enter
チャットルームに入室する。
### タグ
`chatroom` `user`

## POST /api/v1/chatroom/:chatroomId/leave
チャットルームから退出する。
### タグ
`chatroom` `user`

## GET /api/v1/chatroom/:chatroomId/member/search
チャットルームの参加者を検索する。
### タグ
`chatroom` `user`

## POST /api/v1/chatroom/:chatroomId/post
チャットルームへ投稿する。\
投稿の取得や削除、検索に関しては投稿APIを利用する。
### タグ
`chatroom` `post`

## GET /api/v1/chatroom/:chatroomId/timeline
チャットルームのタイムラインを取得する。
### タグ
`chatroom` `post`
