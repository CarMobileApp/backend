const Router = require("express").Router;
const router = Router();

const userCtrl = require("../controllers/user");
const ratingCtrl = require("../controllers/users/rating");
const feedbackCtrl = require("../controllers/users/feedback");

// User Info
router.route("/details").get(userCtrl.getUserDetails);
router.route("/update").patch(userCtrl.updateUser);
// Address
router.route("/address").get(userCtrl.getUserAddresses);
router.route("/address").post(userCtrl.createUserAddress);
router.route("/address/:id").patch(userCtrl.updateUserAddress);
router.route("/address/:id").delete(userCtrl.deleteUserAddress);
// Services
router.route("/services").get(userCtrl.getServices);
// Vehicles
router.route("/vehicles").get(userCtrl.getUserVehicles);
router.route("/vehicles").post(userCtrl.createUserVehicles);
// Booking
router.route("/booking-timings").get(userCtrl.getBookingTimings);
router.route("/booking").post(userCtrl.createBooking);
router.route("/bookings").get(userCtrl.getBookings);
router.route("/booking/cancel").post(userCtrl.updateBookingStatus);
router.route("/booking/rating").post(ratingCtrl.createRating);
// Feedback
router.route("/feedback").post(feedbackCtrl.createFeedback);

module.exports = router;
