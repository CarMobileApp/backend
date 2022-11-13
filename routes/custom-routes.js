const Router = require('express').Router;
const router = Router();
const userCtrl = require('../controllers/user');

// Users
router.route('/users/details').get(userCtrl.getUserDetails);
router.route('/user/update').patch(userCtrl.updateUser);

module.exports = router;
