SELECT
  user_id,
  name,
  display_name,
  password_auth_enabled
FROM "user"
WHERE user_id = coalesce($1, user_id)
AND name = coalesce($2, name)
LIMIT 1
