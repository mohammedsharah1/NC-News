const db = require("../db/connection");
const { topicData } = require("../db/data/test-data");

exports.fetchArticles = (topic) => {
  const validTopics = ["mitch", "cats", "paper"];
  if (!validTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "invalid topic" });
  }

  return db
    .query(
      `SELECT articles.*, 
    COUNT (comments.article_id) :: INT AS comment_count
    FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE topic = $1
    GROUP BY articles.article_id
    ORDER BY created_at DESC`,
      [topic]
    )
    .then(({ rows }) => {
      return rows;
    });
};
