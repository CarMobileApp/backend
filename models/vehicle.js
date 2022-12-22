const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema(
  {
    brand: String,
    model: String,
    registerNumber: String,
    color: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("vehicle", vehicleSchema);
module.exports = Vehicle;
