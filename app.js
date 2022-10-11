const express = require("express");
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/get_topics.controller");
const {
  getArticlesById,
} = require("./controllers/get-articles-by-id.controller");
const { getUsers } = require("./controllers/get-users.controller");
app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/users", getUsers);

app.use("/", (req, res) => {
  res.status(404).send({ msg: "not found" });
});

app.use((err, req, res, next) => {
  if (err.status === 404 && err.msg) {
    res.status(404).send(err);
  }

  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 400 && err.msg) {
    res.status(400).send(err);
  }

  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "internal error" });
});

module.exports = app;
