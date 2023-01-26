const Router = require("express").Router;
const router = Router();

const Errors = require("../errors");

const adminBookingCtrl = require("../controllers/admins/booking");

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== "admin") return next(Errors.forbidden());
  return next();
};

// --- Admins ---
router.route("/bookings").get(isAdmin, adminBookingCtrl.getBookings);
router
  .route("/booking/approve")
  .post(isAdmin, adminBookingCtrl.updateBookingStatus);
router.route("/booking/reject").post(isAdmin, adminBookingCtrl.rejectBooking);

module.exports = router;
