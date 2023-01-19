const Mongoose = require('mongoose');
const config = require('../config');
const logger = require('./log4js').getLogger('MONGO');
const User = require('../models/user');
const Booking = require('../models/booking');
const Address = require('../models/address');
const Admin = require('../models/admin');
const System = require('../models/system');
const Vehicle = require('../models/vehicle')
const Service = require('../models/service')
const Config = require('../models/config')

/**
 * @type {Object.<string, Mongoose.Model<Document, {}>>}
 */
let models = {};

class Mongo{
    constructor(uri) {
        this.uri = uri || config.MONGO_URL;
        this.isConnected = false;
    }

    async connect() {
        try {
            const client = await Mongoose.connect(this.uri);
            logger.info('Connected to DB ' + this.uri);
            Mongo.client = client;
            this.isConnected = true;
            models.users = User;
            models.bookings = Booking;
            models.address = Address;
            models.admin = Admin;
            models.system = System;
            models.vehicles = Vehicle;
            models.services = Service;
            models.config = Config;
            logger.debug('Generated Models');
        } catch(e) {
            logger.error(e);
            process.exit(1);
        }
    }

    static getModels() {
        return models;
    }

    async disconnect() {
        await Mongo.disconnect();
    }

    static async disconnect() {
        logger.debug('Closing DB connection');
        await Mongo.client.disconnect();
    }
}

module.exports = Mongo;
