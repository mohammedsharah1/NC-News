const db = require("../db/connection");

exports.fetchArticles = (topic, sort_by = "created_at", order = "DESC") => {
  order = order.toUpperCase();
  const validOrder = ["ASC", "DESC"];
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid input" });
  }
  const validSortBy = [
    "article_id",
    "comment_count",
    "title",
    "author",
    "created_at",
    "votes",
  ];
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort_by input" });
  }

  let allArticlesQuery = `SELECT articles.*, 
COUNT(comments.article_id) :: INT AS comment_count
FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const topicArr = [];
  const validTopics = ["mitch", "cats", "paper"];
  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 404, msg: "invalid topic" });
  }

  if (validTopics.includes(topic)) {
    allArticlesQuery += ` WHERE topic = $1`;
    topicArr.push(topic);
  }
  allArticlesQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(allArticlesQuery, topicArr).then(({ rows }) => {
  
    return rows;
  });
};

// exports.fetchAllArticles = (topic, sort_by = "created_at", order = 'DESC') =>{

//   order = order.toUpperCase()
//   const acceptableOrder = ["ASC", "DESC"]
//   if(!acceptableOrder.includes(order)){
//       return Promise.reject({status: 400, msg: "invalid input"})
//   }
//   const acceptablesSortBy =[
//       "article_id",
//       "comment_count",
//       "title",
//       "author",
//       "created_at",
//       "votes",
//     ];
//     if(!acceptablesSortBy.includes(sort_by)){
//       return Promise.reject({status: 400, msg: "invalid sort_by input"})
//   }

//   let firstQuery = `SELECT articles.*,
//   COUNT(comments.article_id) ::INT as comment_count
//   FROM articles
//   LEFT JOIN comments
//   ON comments.article_id = articles.article_id`

//   if(topic){
//       firstQuery += ` WHERE articles.topic = '${topic}'`
//   }
//   firstQuery += ` GROUP BY articles.article_id
//   ORDER BY ${sort_by} ${order}`

//   return db.query(firstQuery)
//   .then(({rows}) => {
//     if(rows.length === 0){
//         return Promise.reject({status: 404, msg: 'data not found',})
//     }
//     return rows
// })
// }
