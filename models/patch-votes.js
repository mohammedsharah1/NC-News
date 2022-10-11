const db = require("../db/connection");

exports.patchVotes = (article_id, votes) => {
  if (!votes) {
    return Promise.reject({
      status: 400,
      msg: "vote increment has not been provided",
    });
  } else {
    return db
      .query(
        `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`,
        [article_id, votes]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "id not found" });
        } else {
          return rows[0];
        }
      });
  }
};
