const { fetchArticlesById } = require("../models/fetch_articles_by_id");

exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticlesById(id)
    .then((articles) => {
      res.status(200).send({ articles});
    })
    .catch((err) => {
      next(err);
    });
};
