const { fetchArticles } = require("../models/fetch_articles");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  fetchArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
