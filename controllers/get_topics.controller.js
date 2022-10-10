const { fetchTopics } = require("../models/fetch-topics");
exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
