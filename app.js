const express = require("express");
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/get_topics.controller");

app.get("/api/topics", getTopics);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal error" });
});

module.exports = app;
