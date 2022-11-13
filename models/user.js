const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    mobileNumber: String,
    password: String,
    devicesNumber: Number,
    addressIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
