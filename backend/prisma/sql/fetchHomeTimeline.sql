-- @param {String} $1:userId
-- @param {Int} $2:limit

SELECT
  p.post_id,
  p.chat_room_id,
  p.user_id,
  p.content
FROM post AS p
WHERE p.user_id = $1
AND p.chat_room_id IS NULL
LIMIT $2
