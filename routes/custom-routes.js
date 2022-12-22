const Router = require("express").Router;
const router = Router();
const userCtrl = require("../controllers/user");

// Users
router.route("/user/details").get(userCtrl.getUserDetails);
router.route("/user/update").patch(userCtrl.updateUser);
// Address
router.route("/user/address").get(userCtrl.getUserAddresses);
router.route("/user/address").post(userCtrl.createUserAddress);
router.route("/user/address/:id").patch(userCtrl.updateUserAddress);
router.route("/user/address/:id").delete(userCtrl.deleteUserAddress);
// Services
router.route("/user/services").get(userCtrl.getServices);
// Vehicles
router.route("/user/vehicles").get(userCtrl.getUserVehicles);
router.route("/user/vehicles").post(userCtrl.createUserVehicles);

module.exports = router;
