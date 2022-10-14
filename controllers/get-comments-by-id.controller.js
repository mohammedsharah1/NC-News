const { fetchComments } = require("../models/fetch-comments-by-id");
const { fetchArticlesById } = require("../models/fetch_articles_by_id");

exports.getCommentsById = (req, res, next) => {
  const id = +req.params.article_id;

  if (!Number.isInteger(id)) {
    return res.status(400).send({ msg: "invalid id/vote" });
  }

  fetchArticlesById(id)
    .then(() => {
      fetchComments(id).then((comments) => {
        if (comments.length < 1) {
          return res.status(404).send({ msg: "not found" });
        } else {
          res.status(200).send({ comments });
        }
      });
    })

    .catch((err) => {
      next(err);
    });
};
