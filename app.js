const express = require("express");
const cors = require('cors');


const { getTopics } = require("./controllers/get_topics.controller");
const {
  getArticlesById,
} = require("./controllers/get-articles-by-id.controller");

const { getUsers } = require("./controllers/get-users.controller");
const { getArticles } = require("./controllers/get-articles.controller");

const {
  handle404,
  handleCustomErrors,
  handleInternalErrors,
  handlePSQLErrors,
  foreignError,
} = require("./controllers/errors.controller");
const { updateVotes } = require("./controllers/update-votes.controller");
const {
  getCommentsById,
} = require("./controllers/get-comments-by-id.controller");
const { newComment } = require("./controllers/new-comment.controller");
const { removeComment } = require("./controllers/remove-comment.controller");
const { getApi } = require("./controllers/get-api.controller");

const app = express();
app.use(express.json());
app.use(cors());


app.post("/api/articles/:article_id/comments", newComment);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);

app.patch("/api/articles/:article_id", updateVotes);
app.delete('/api/comments/:comment_id', removeComment)
app.get("/api/articles/:article_id/comments", getCommentsById);
app.get('/api', getApi)

app.use("/", handle404);

app.use(handleCustomErrors);

app.use(foreignError);
app.use(handlePSQLErrors);

app.use(handleInternalErrors);

module.exports = app;
