const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.MONGO_URL).then(async () => {
    const db = mongoose.connection;
    let newUser = [{
        projectName: 'CarWashAutomation',
        startHour: 8,
        endHour: 21,
        isActive: true
    }];
    db.collection('systems').insertOne(newUser, (error) => {
        if (error) {
            console.log(error);
        }
        db.close();
    });
});
