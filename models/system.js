const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimeSchema = mongoose.Schema({
  hour: String,
  minute: String,
});

const systemSchema = new Schema({
  day: Number,
  slotTime: {
    type: TimeSchema,
    required: true,
  },
  startTime: {
    type: TimeSchema,
    required: true,
  },
  endTime: {
    type: TimeSchema,
    required: true,
  },
  breakStartTime: {
    type: TimeSchema,
    required: true,
  },
  breakEndTime: {
    type: TimeSchema,
    required: true,
  },
  holiday: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("system", systemSchema);
