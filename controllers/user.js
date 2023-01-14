const Auth = require("../auth/jwt-auth");
var bcrypt = require("bcrypt");
const logger = require("../utils/log4js").getLogger("USER-CTRL");
const Errors = require("../errors");
const config = require("../config");
const secrets = {
  JWT_SECRET: config.JWT_SECRET,
  JWT_PL_SECRET: config.JWT_PL_SECRET,
  JWT_SALT: config.JWT_SALT,
};
const auth = new Auth(secrets);
const Models = require("../utils/mongo").getModels();
const AddressModel = require("../models/address");
const moment = require("moment");

module.exports.signup = async (req, res, next) => {
  const { firstName, lastName, email, mobileNumber, password, addressObj } =
    req.body;
  if (!firstName || !lastName || !email || !mobileNumber || !password) {
    return next(Errors.invalidRequest("Please provide the required fields!"));
  }
  logger.debug(`Login request by ${req.body.mobileNumber}`);

  let user;
  try {
    user = await Models.users
      .findOne({ mobileNumber: String(req.body.mobileNumber) })
      .exec();
  } catch (e) {
    return next(e);
  }
  if (user) {
    return next(Errors.userAlreadyRegistered("User already exists!"));
  }
  if (!user) {
    const UserModel = Models.users;
    user = new UserModel({
      firstName: String(firstName),
      lastName: String(lastName),
      email: String(email),
      mobileNumber: String(mobileNumber),
      password: String(await bcrypt.hash(password, 10)),
    });
    if (addressObj && Object.keys(addressObj).length > 0) {
      const address = new AddressModel({
        firstName: String(addressObj?.firstName),
        lastName: String(addressObj?.lastName),
        mobileNumber: String(addressObj?.mobileNumber),
        addressString: String(addressObj?.addressString),
        landmark: String(addressObj?.landmark),
        state: String(addressObj?.state),
        pincode: String(addressObj?.pincode),
        default: true,
        status: "CREATED",
        userId: user._id,
      });
      user.addressIds.push(address._id);
      await address.save();
    }
  }
  try {
    await user.save();
  } catch (e) {
    return next(e);
  }

  return res.json({
    status: "success",
  });
};

module.exports.login = async (req, res, next) => {
  const { mobileNumber, password } = req.body;
  if (!mobileNumber || !password) {
    return next(Errors.invalidRequest("Please provide the required fields!"));
  }
  logger.debug(`Login request by ${mobileNumber}`);

  let user;
  try {
    user = await Models.users.findOne({ mobileNumber: mobileNumber });
    if (!user) {
      return next(Errors.invalidUser());
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return next(Errors.invalidLogin("Wrong password"));
    }
  } catch (e) {
    return next(e);
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
  const token = auth.generateToken(user);
  logger.debug("Generated token for user " + user._id);
  user.password = undefined;
  return res.json({
    status: "success",
    user,
    token,
  });
};

module.exports.getUserDetails = async (req, res, next) => {
  const user = req.user;
  return res.json({
    status: "success",
    user,
  });
};

module.exports.updateUser = async (req, res, next) => {
  let user;
  try {
    let obj = {};
    obj = req.body;
    if (obj?.password) {
      obj = { ...obj, password: String(await bcrypt.hash(obj?.password, 10)) };
    }
    user = await Models.users.findOneAndUpdate(
      { _id: req.user._id },
      { $set: obj },
      { new: true }
    );
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", user });
};

module.exports.getUserAddresses = async (req, res, next) => {
  let data;
  try {
    data = await Models.address
      .find({
        userId: req.user._id,
        status: { $in: ["CREATED", "UPDATED"] },
      })
      .exec();
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data });
};

module.exports.createUserAddress = async (req, res, next) => {
  let data;

  const {
    firstName,
    lastName,
    mobileNumber,
    addressString,
    landmark,
    state,
    pincode,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !mobileNumber ||
    !addressString ||
    !landmark ||
    !state ||
    !pincode
  ) {
    return next(Errors.invalidRequest("Please provide the required fields!"));
  }

  const AddressModel = Models.address;
  data = new AddressModel({
    firstName: String(firstName),
    lastName: String(lastName),
    mobileNumber: String(mobileNumber),
    addressString: String(addressString),
    landmark: String(landmark),
    state: String(state),
    pincode: String(pincode),
    default: false,
    status: "CREATED",
    userId: req.user._id,
  });

  try {
    data.save();
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data });
};

module.exports.updateUserAddress = async (req, res, next) => {
  let address;

  if (Object.keys(req.body).length === 0) {
    return next(Errors.invalidRequest("Please provide fields to update!"));
  }

  try {
    address = await Models.address.findOneAndUpdate(
      { _id: req?.params?.id },
      {
        $set: {
          ...req.body,
          status: "UPDATED",
        },
      },
      { new: true }
    );

    if (req.body.default) {
      let defaultAddress;
      defaultAddress = await Models.address.findOne({
        userId: req.user._id,
        _id: { $nin: [address?._id] },
        default: true,
      });

      if (defaultAddress) {
        await Models.address.findOneAndUpdate(
          { _id: defaultAddress?.id },
          { $set: { default: false, status: "UPDATED" } },
          { new: true }
        );
      }
    }
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data: address });
};

module.exports.deleteUserAddress = async (req, res, next) => {
  try {
    await Models.address.findOneAndUpdate(
      { _id: req?.params?.id },
      {
        $set: {
          status: "DELETED",
        },
      },
      { new: true }
    );
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success" });
};

module.exports.getServices = async (req, res, next) => {
  let data;
  try {
    data = await Models.services.find({}).select("name -_id").exec();
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data });
};

module.exports.getUserVehicles = async (req, res, next) => {
  let data;
  try {
    data = await Models.vehicles
      .find({
        userId: req.user._id,
      })
      .select("brand model registerNumber color _id")
      .exec();
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data });
};

module.exports.createUserVehicles = async (req, res, next) => {
  let data;

  const { brand, model, registerNumber, color } = req.body;

  if (!brand || !model || !registerNumber || !color) {
    return next(Errors.invalidRequest("Please provide the required fields!"));
  }

  const VehicesModel = Models.vehicles;
  data = new VehicesModel({
    brand: String(brand),
    model: String(model),
    registerNumber: String(registerNumber),
    color: String(color),
    userId: req.user._id,
  });

  try {
    data.save();
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data });
};

module.exports.getBookingTimings = async (req, res, next) => {
  let data;
  let bookingTimings = [];
  let bookedTimings = [];
  let startTime;
  let endTime;
  let breakStartTime;
  let breakEndTime;
  try {
    data = await Models.system
      .findOne({ day: new Date().getDay(), isActive: true })
      .exec();

    if (!data || data?.holiday) {
      return res.json({
        status: "success",
        msg: "Service is Temporarily Closed",
        type: "HOLIDAY",
      });
    }

    bookedTimings = await Models.bookings
      .find({
        userId: req.user._id,
        time: {
          $gte: moment().startOf("day"),
          $lt: moment().endOf("day"),
        },
        $or: [{ status: "PENDING" }, { status: "APPROVED" }],
      })
      .exec();

    const isBooked = (time) => {
      let booked = false;
      bookedTimings.map((b) => {
        if (moment(moment(b.time).format()).isSame(time)) {
          booked = true;
        }
      });
      return booked;
    };

    startTime = moment(moment().startOf("day"))
      .add(data?.startTime?.hour, "h")
      .add(data?.startTime?.minute, "m")
      .format();

    endTime = moment(moment().startOf("day"))
      .add(data?.endTime?.hour, "h")
      .add(data?.endTime?.minute, "m")
      .format();

    breakStartTime = moment(moment().startOf("day"))
      .add(data?.breakStartTime?.hour, "h")
      .add(data?.breakStartTime?.minute, "m")
      .format();

    breakEndTime = moment(moment().startOf("day"))
      .add(data?.breakEndTime?.hour, "h")
      .add(data?.breakEndTime?.minute, "m")
      .format();

    for (
      var i = startTime;
      i < endTime;
      i = moment(i)
        .add(data?.slotTime?.hour, "h")
        .add(data?.slotTime?.minute, "m")
        .format()
    ) {
      if (i < breakStartTime || i >= breakEndTime) {
        if (
          !isBooked(i) &&
          moment().format() < moment(i).subtract(15, "m").format()
        ) {
          bookingTimings = [...bookingTimings, { time: i }];
        }
      }
    }
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data: bookingTimings });
};

module.exports.createBooking = async (req, res, next) => {
  let booking;
  let data;
  let bookingTimings = [];
  let bookedTimings = [];
  let startTime;
  let endTime;
  let breakStartTime;
  let breakEndTime;

  const { time, vehicleIds, addressId } = req.body;

  if (!time || !vehicleIds || !addressId) {
    return next(Errors.invalidRequest("Please provide the required fields!"));
  }

  if (!moment(time).isValid()) {
    return next(Errors.invalidRequest("Invalid date format."));
  }

  try {
    data = await Models.system
      .findOne({ day: new Date().getDay(), isActive: true })
      .exec();

    if (!data || data?.holiday) {
      return res.json({
        status: "success",
        msg: "Service is Temporarily Closed",
        type: "HOLIDAY",
      });
    }

    bookedTimings = await Models.bookings
      .find({
        userId: req.user._id,
        time: {
          $gte: moment().startOf("day"),
          $lt: moment().endOf("day"),
        },
        $or: [{ status: "PENDING" }, { status: "APPROVED" }],
      })
      .exec();

    const isBooked = (time) => {
      let booked = false;
      bookedTimings.map((b) => {
        if (moment(moment(b.time).format()).isSame(time)) {
          booked = true;
        }
      });
      return booked;
    };

    startTime = moment(moment().startOf("day"))
      .add(data?.startTime?.hour, "h")
      .add(data?.startTime?.minute, "m")
      .format();

    endTime = moment(moment().startOf("day"))
      .add(data?.endTime?.hour, "h")
      .add(data?.endTime?.minute, "m")
      .format();

    breakStartTime = moment(moment().startOf("day"))
      .add(data?.breakStartTime?.hour, "h")
      .add(data?.breakStartTime?.minute, "m")
      .format();

    breakEndTime = moment(moment().startOf("day"))
      .add(data?.breakEndTime?.hour, "h")
      .add(data?.breakEndTime?.minute, "m")
      .format();

    for (
      var i = startTime;
      i < endTime;
      i = moment(i)
        .add(data?.slotTime?.hour, "h")
        .add(data?.slotTime?.minute, "m")
        .format()
    ) {
      if (i < breakStartTime || i >= breakEndTime) {
        if (
          !isBooked(i) &&
          moment().format() < moment(i).subtract(15, "m").format()
        ) {
          bookingTimings = [...bookingTimings, { time: i }];
        }
      }
    }

    const isValidTiming = (time) => {
      let isValid = true;
      bookingTimings.map((b) => {
        if (moment(moment(b.time).format()).isSame(time)) {
          isValid = false;
        }
      });
      return isValid;
    };

    if (isValidTiming(moment(time).format())) {
      return res.json({
        status: "success",
        msg: "Invalid Slot.",
        type: "INVALID",
      });
    }

    if (moment().format() > moment(time).subtract(15, "m").format()) {
      return res.json({
        status: "success",
        msg: "Slot booking time is over.",
        type: "EXPIRED",
      });
    }

    const BookingModel = Models.bookings;
    booking = new BookingModel({
      vehicleIds: vehicleIds,
      addressId: addressId,
      time: moment(time).format(),
      status: "PENDING",
      userId: req.user._id,
    });

    booking.save();
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", booking });
};

module.exports.getBookings = async (req, res, next) => {
  let data;
  let test;
  try {
    const { status } = req?.query;

    if (!status) {
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

    let obj = { userId: req.user._id };

    if (status !== "ALL") {
      obj = { ...obj, status: status };
    }

    data = await Models.bookings
      .find(obj)
      .select("time status _id createdAt")
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

    // test = await Models.bookings.aggregate([
    //   { $match: { userId: req.user._id } },
    //   {
    //     $lookup: {
    //       from: "addresses",
    //       localField: "addressId",
    //       foreignField: "_id",
    //       as: "address",
    //     },
    //   },
    //   { $unwind: "$address" },
    //   {
    //     $lookup: {
    //       from: "vehicles",
    //       localField: "vehicleIds",
    //       foreignField: "_id",
    //       as: "vehicles",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       priority: {
    //         $cond: { if: { $eq: ["$status", "APPROVED"] }, then: 2, else: 1 },
    //       },
    //     },
    //   },
    //   { $sort: { priority: -1, createdAt: -1 } },
    // ]);
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data });
};

module.exports.updateBookingStatus = async (req, res, next) => {
  let data;

  if (!req.body.bookingId) return next(Errors.invalidRequest('Invalid Booking'));

  try {
    data = await Models.bookings.findOneAndUpdate(
      { _id: req.body.bookingId, status: "PENDING" },
      {
        $set: {
          status: "CANCELLED",
        },
      },
      { new: true }
    );
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", data });
};
