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
    status: "success"
  });
};

module.exports.login = async (req, res, next) => {
	const {  mobileNumber, password } =
    req.body;
  if (!mobileNumber || !password) {
    return next(Errors.invalidRequest("Please provide the required fields!"));
  }
  logger.debug(`Login request by ${mobileNumber}`);

  let user;
  try {
	  user = await Models.users.findOne({mobileNumber: mobileNumber});
	  if (!user) {
		  return next(Errors.invalidUser());
	  }
	  const isMatched = await bcrypt.compare(password, user.password);
	  if (!isMatched) {
		  return next(Errors.invalidLogin('Wrong password'));
	  }
  } catch(e) {
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
  user.password = undefined
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
    user = await Models.users.findOneAndUpdate(
      { _id: req.user._id },
      { $set: req.body },
      { new: true }
    );
  } catch (e) {
    return next(e);
  }
  return res.json({ status: "success", user });
};
