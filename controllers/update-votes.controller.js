const { patchVotes } = require("../models/patch-votes");

exports.updateVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { votes } = req.body;
  patchVotes(article_id, votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
