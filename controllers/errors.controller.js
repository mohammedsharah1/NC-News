function handle404(req, res) {
  res.status(404).send({ msg: "not found" });
}

function handlePSQLErrors(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id/vote" });
  }
  next(err);
}

function handleCustomErrors(err, req, res, next) {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

function foreignError(err, req, res, next) {
  if (err.code === "23503") {
    res.status(404).send({ msg: "foreign key/id not found" });
  }
  next(err);
}

function handleInternalErrors(err, req, res, next) {
  console.log(err);
  res.status(500).send({ message: "internal error" });
}
module.exports = {
  handle404,
  handlePSQLErrors,
  handleCustomErrors,
  foreignError,
  handleInternalErrors,
};
