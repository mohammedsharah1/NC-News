const db = require("../db/connection");
exports.fetchComments = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return rows.push("no comments exist");
      } else {
        return rows;
      }
    });
};
