-- @param {String} $1:name
SELECT
  user_id,
  name,
  display_name,
  password_auth_enabled
FROM "user"
WHERE name = $1
LIMIT 1
