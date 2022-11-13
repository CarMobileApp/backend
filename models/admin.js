const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    devicesNumber: Number
  }, { timestamps: true });

const admin = mongoose.model('admin', adminSchema);
module.exports = admin;
