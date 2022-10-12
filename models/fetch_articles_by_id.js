const db = require("../db/connection");

exports.fetchArticlesById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1
    COUNT (comments.article_id) ::INT AS comment_count;`, [id])
    .then(({ rows }) => {
      if (rows.length !== 0) {
        return rows[0]

      } else {
        return Promise.reject({
          status: 404,
          msg: "id not found",
        });
      }
    });
};
