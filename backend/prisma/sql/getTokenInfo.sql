-- @param {String} $1:token

SELECT
  t.user_id,
  t.token_kind,
  array_agg(s.scope_name) AS scopes
FROM token AS t
LEFT JOIN token_scope AS s
  ON s.token_id = t.token_id
WHERE t.token = $1
GROUP BY t.token_id
