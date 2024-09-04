-- @param {String} $1:userId
-- @param {String} $2:cursor
-- @param {Int} $3:limit

SELECT
  p.post_id,
  p.chat_room_id,
  p.user_id,
  p.content
FROM post AS p
WHERE p.user_id = $1
AND p.chat_room_id IS NULL
AND $2 = $2
LIMIT $3
