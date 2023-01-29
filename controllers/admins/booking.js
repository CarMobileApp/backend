const moment = require("moment");

const Errors = require("../../errors");
const Models = require("../../utils/mongo").getModels();

module.exports.getBookings = async (req, res, next) => {
  let data;
  let count;
  try {
    const { status, offset, limit } = req?.query;

    if (!status || !offset || !limit) {
      return next(Errors.invalidRequest("Please provide the required fields!"));
    }

    if (
      status !== "ALL" &&
      status !== "PENDING" &&
      status !== "APPROVED" &&
      status !== "CANCELLED" &&
      status !== "PROCESSED" &&
      status !== "REJECTED"
    ) {
      return next(Errors.invalidRequest("Please provide the valid fields!"));
    }

    let obj = {};

    if (status !== "ALL") {
      obj = { ...obj, status: status };
    }

    data = await Models.bookings
      .find(obj)
      .select("time status _id createdAt")
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .populate({
        path: "vehicleIds",
        select: "brand model registerNumber color",
      })
      .populate({
        path: "addressId",
        select:
          "firstName lastName mobileNumber addressString landmark state pincode",
      })
      .sort({ createdAt: -1 })
      .exec();

    count = await Models.bookings.count(obj).exec();
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data, count });
};

module.exports.updateBookingStatus = async (req, res, next) => {
  let data;

  if (!req.body.bookingId)
    return next(Errors.invalidRequest("Invalid Booking"));

  try {
    data = await Models.bookings.findOneAndUpdate(
      { _id: req.body.bookingId, status: "PENDING" },
      {
        $set: {
          status: "APPROVED",
        },
      },
      { new: true }
    );
  } catch (e) {
    return next(e);
  }
  console.log({ data });
  return res.json({ status: "success", data });
};

module.exports.rejectBooking = async (req, res, next) => {
  let data;

  if (!req.body.bookingId)
    return next(Errors.invalidRequest("Invalid Booking"));

  try {
    data = await Models.bookings.findOneAndUpdate(
      {
        _id: req.body.bookingId,
        $or: [{ status: "PENDING" }, { status: "APPROVED" }],
      },
      {
        $set: {
          status: "REJECTED",
        },
      },
      { new: true }
    );
  } catch (e) {
    return next(e);
  }
  console.log({ data });
  return res.json({ status: "success", data });
};
