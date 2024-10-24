-- @param {String} $1:userId
-- @param {Int} $2:limit

SELECT
  p.post_id,
  p.post_kind,
  p.chat_room_id,
  p.user_id,
  p.content,
  p.created_at
FROM "post" AS p
WHERE p.post_kind = 'timeline'
  AND CAST($1 AS UUID) = CAST($1 AS UUID)
ORDER BY p.created_at DESC, p.post_id DESC
LIMIT $2
;
