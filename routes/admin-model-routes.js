const Router = require('express').Router;
const router = Router();
const Errors = require('../errors');
const restify = require('express-restify-mongoose');

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.type !== 'admin') return next(Errors.forbidden());
    return next();
};

restify.defaults({
	version: '/v1',
	findOneAndUpdate: false,
	findOneAndRemove: false,
	preDelete: isAdmin
});

restify.serve(router, require('../models/system'), {
    preMiddleware: isAdmin
});

restify.serve(router, require('../models/user'), {
    preMiddleware: isAdmin
});

module.exports = router;
