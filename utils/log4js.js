const log4js = require('log4js');
const cls = require('../utils/cls');

log4js.configure({
    appenders: {
        app: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '[%[%d%]] [%[%p%]] [%x{userId}] [%[%c%]] - %m',
                tokens: {
                    userId: getUserId
                }
            }
        }
    },
    categories: {
        default: {
            appenders: [
                'app'
            ],
            level: 'DEBUG'
        }
    }
});

function getUserId() {
    const user = cls.get('user');
    let _id = user && user._id || 'none';
    return _id;
}

module.exports = log4js;
