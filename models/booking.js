const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    bookingId: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    vehicleIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicle",
      },
    ],
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
    time: Date,
    //   PENDING
    //   APPROVED
    //   REJECTED
    //   PROCESSED
    //   CANCELLED
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("booking", BookingSchema);
