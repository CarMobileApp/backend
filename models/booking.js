const mongoose = require('mongoose');
// const Counter = require('./counter');
const Admin = require('./admin');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({

});

module.exports = mongoose.model('booking', BookingSchema);
