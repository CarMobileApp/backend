const Auth = require('../auth/jwt-auth');
const logger = require('../utils/log4js').getLogger('USER-CTRL');
const Errors = require('../errors');
const config = require('../config');
const secrets = {
    JWT_SECRET: config.JWT_SECRET,
    JWT_PL_SECRET: config.JWT_PL_SECRET,
    JWT_SALT: config.JWT_SALT
};
const auth = new Auth(secrets);
const bcrypt = require('bcrypt');
const Models = require('../utils/mongo').getModels();

module.exports.login = async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return next(Errors.invalidRequest('Username and Password are required'));
    }
    logger.debug(`Login request by ${req.body.username}`);
    let user;
    try {
        user = await Models.admin.findOne({username: req.body.username});
        if (!user) {
            return next(Errors.invalidUser());
        }
        const isMatched = await bcrypt.compare(req.body.password, user.password);
        if (!isMatched) {
            return next(Errors.invalidLogin('Wrong password'));
        }
    } catch(e) {
        return next(e);
    }
    if (req.body.pushToken) {
        user.pushToken = req.body.pushToken;
    }
    if (!user.devicesNumber) {
        user.devicesNumber = 0;
    }
    user.devicesNumber++;
    try {
        await user.save();
    } catch (e) {
        return next(e);
    }
    const token = auth.generateToken(user, 'admin');
    logger.debug('Generated token for admin ' + user._id);
    user.password = undefined
    return res.json({
        status: 'success',
        user,
        token,
    });
};
