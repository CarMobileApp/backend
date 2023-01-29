const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    feedback: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedback", FeedbackSchema);
