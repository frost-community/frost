-- @param {String} $1:userId
-- @param {String} $2:cursor
-- @param {Int} $3:limit

SELECT
  p.post_id,
  p.chat_room_id,
  p.user_id,
  p.content,
  p.created_at
FROM post AS p,
  (SELECT x.post_id, x.created_at FROM post AS x WHERE x.post_id = CAST($2 AS UUID)) AS cur
WHERE p.chat_room_id IS NULL
  AND CAST($1 AS UUID) = CAST($1 AS UUID)
  -- カーソル値よりも古いリソースを取得
  AND p.created_at < cur.created_at
  OR (p.created_at = cur.created_at AND p.post_id < cur.post_id)
ORDER BY p.created_at DESC, p.post_id DESC
LIMIT $3
