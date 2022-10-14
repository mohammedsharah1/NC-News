const db = require("../db/connection");

exports.fetchArticlesById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT (comments.article_id) ::INT AS comment_count
      FROM articles LEFT JOIN comments
      ON comments.article_id = articles.article_id
      WHERE articles.article_id=$1
      GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length !== 0) {
        return rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "id not found",
        });
      }
    });
};
