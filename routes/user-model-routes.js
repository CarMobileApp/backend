const Router = require("express").Router;
const router = Router();
const restify = require("express-restify-mongoose");

restify.defaults({
  version: "/v1/user",
  findOneAndUpdate: false,
  findOneAndRemove: false,
});

module.exports = router;
