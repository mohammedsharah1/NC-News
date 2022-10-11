const express = require("express");
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/get_topics.controller");
const {
  getArticlesById,
} = require("./controllers/get-articles-by-id.controller");
const {
  handle404,
  handleCustomErrors,
  handleInternalErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.use("/", handle404);

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleInternalErrors);

module.exports = app;
