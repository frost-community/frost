-- @param {String} $1:userId
-- @param {Int} $2:limit

SELECT
  p.post_id,
  p.chat_room_id,
  p.user_id,
  p.content,
  p.created_at
FROM post AS p
WHERE p.user_id = CAST($1 AS UUID)
  AND p.chat_room_id IS NULL
ORDER BY p.created_at ASC
LIMIT $2
