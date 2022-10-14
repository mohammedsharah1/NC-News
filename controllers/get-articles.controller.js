const { fetchArticles } = require("../models/fetch_articles");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  fetchArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
