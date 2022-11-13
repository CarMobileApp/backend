const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const systemSchema = new Schema({
    projectName: String,
    startHour: Number,
    endHour: Number,
    isActive: Boolean
});

module.exports = mongoose.model('system', systemSchema);
