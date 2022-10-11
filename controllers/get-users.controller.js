const { fetchUsers } = require("../models/fetch-users");
exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};
