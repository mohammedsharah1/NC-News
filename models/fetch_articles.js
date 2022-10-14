const db = require("../db/connection");

exports.fetchArticles = (topic) => {
  let allArticlesQuery = `SELECT articles.*, 
COUNT(comments.article_id) :: INT AS comment_count
FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const topicArr = [];
  const validTopics = ["mitch", "cats", "paper"];
  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "invalid topic" });
  }

  if (validTopics.includes(topic)) {
    allArticlesQuery += ` WHERE topic = $1`;
    topicArr.push(topic);
  }
  allArticlesQuery += ` GROUP BY articles.article_id ORDER BY created_at DESC;`;

  return db.query(allArticlesQuery, topicArr).then(({ rows }) => {
    return rows;
  });
};
