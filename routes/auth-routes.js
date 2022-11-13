const Router = require('express').Router;
const router = Router();
const userCtrl = require('../controllers/user');
const adminCtrl = require('../controllers/admin');

// Users
router.route('/users/signup').post(userCtrl.signup);
router.route('/users/login').post(userCtrl.login);

// admin login
router.route('/admins/login').post(adminCtrl.login);

module.exports = router;
