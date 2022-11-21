const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cls = require("../utils/cls");

const AddressSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    mobileNumber: String,
    default: Boolean,
    addressString: String,
    landmark: String,
    state: String,
    pincode: String,
    status: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
  },
  { timestamps: true }
);

AddressSchema.pre("save", function (next) {
  if (this.isNew) {
    const user = cls.get("user");
    if (user) {
      this.userId = user._id;
    }
  }
  return next();
});

module.exports = mongoose.model("address", AddressSchema);
