-- @param {String} $1:userId
-- @param {String} $2:cursor
-- @param {Int} $3:limit

SELECT
  p.post_id,
  p.chat_room_id,
  p.user_id,
  p.content
FROM post AS p
WHERE p.user_id = CAST($1 AS UUID)
AND p.chat_room_id IS NULL
AND CAST($2 AS UUID) = CAST($2 AS UUID)
--ORDER BY p.created_at DESC
LIMIT $3
