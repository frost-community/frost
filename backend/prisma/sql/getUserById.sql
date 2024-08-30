-- @param {String} $1:user_id
SELECT
  user_id,
  name,
  display_name,
  password_auth_enabled
FROM "user"
WHERE user_id = $1
LIMIT 1
