const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingCountSchema = mongoose.Schema({
  day: Number,
  count: Number,
});

const configSchema = new Schema({
  bookingStatus: bookingCountSchema,
  bookingCounter: Number,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("config", configSchema);
