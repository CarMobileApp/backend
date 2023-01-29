const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    rating: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("rating", RatingSchema);
