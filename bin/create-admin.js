const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const config = require('../config');

mongoose.connect(config.MONGO_URL).then(async () => {
    const db = mongoose.connection;
    let newUser = [{
        username: 'gowty',
        password: 'admin@123',
    }, {
        username: 'pavithra',
        password: 'admin@123',
    }, {
        username: 'sanjith',
        password: 'admin@123',
    }];
    for (const u of newUser) {
        u.password = await bcrypt.hash(u.password, 10);
        u.createdAt = new Date();
    }
    db.collection('admins').insertMany(newUser, (error) => {
        if (error) {
            console.log(error);
        }
        db.close();
    });
});
