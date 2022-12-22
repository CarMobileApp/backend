const Router = require("express").Router;
const router = Router();
const Errors = require("../errors");
const restify = require("express-restify-mongoose");

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== "admin") return next(Errors.forbidden());
  return next();
};

restify.defaults({
  version: "/v1/admin",
  findOneAndUpdate: false,
  findOneAndRemove: false,
  preDelete: isAdmin,
});

restify.serve(router, require("../models/system"), {
  preMiddleware: isAdmin,
});

restify.serve(router, require("../models/user"), {
  name: "users",
  preMiddleware: isAdmin,
});

restify.serve(router, require("../models/service"), {
  preMiddleware: isAdmin,
  outputFn: (req, res) => {
    const result = req.erm.result; // filtered object
    const statusCode = req.erm.statusCode; // 200 or 201
    res.status(statusCode).json({ status: "success", data: result });
  },
});

module.exports = router;
