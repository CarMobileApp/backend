const Router = require('express').Router;
const router = Router();
const userCtrl = require('../controllers/user');

// Users
router.route('/users/details').get(userCtrl.getUserDetails);
router.route('/user/update').patch(userCtrl.updateUser);
router.route('/user/address').get(userCtrl.getUserAddresses);
router.route('/user/address').post(userCtrl.createUserAddress);
router.route('/user/address/:id').patch(userCtrl.updateUserAddress);
router.route('/user/address/:id').delete(userCtrl.deleteUserAddress);

module.exports = router;
