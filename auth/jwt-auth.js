const crypto = require('crypto');
const IV_LENGTH = 16;
const jwt = require('jsonwebtoken');
const Models = require('../utils/mongo').getModels();
const logger = require('../utils/log4js').getLogger('JWT-AUTH');
const Errors = require('../errors');

class JwtAuth {
    constructor(secrets) {
        this.jwtSecret = secrets.JWT_SECRET;
        const jwtPayLoadSecret = secrets.JWT_PL_SECRET;
        const jwtSalt = secrets.JWT_SALT;
        this.key = crypto.pbkdf2Sync(jwtPayLoadSecret, jwtSalt, 65536, 32, 'sha1');
    }

    encrypt(data, key) {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return Buffer.concat([iv, encrypted]).toString('base64');
    }

    decrypt(data, key) {
        const buff = new Buffer(data, 'base64');
        const iv = buff.slice(0, IV_LENGTH);
        const encryptedText = buff.slice(IV_LENGTH, buff.length);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = decipher.update(encryptedText);
        return Buffer.concat([decrypted, decipher.final()]).toString();
    }

    generateToken(user, type) {
        const expirationDate = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000);
        const payloadObj = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            devicesNumber: user.devicesNumber,
            addressIds: user.addressIds
        };
        if (type) payloadObj.type = type;
        const encryptedPayload = this.encrypt(JSON.stringify(payloadObj), this.key);
        return jwt.sign({
            sub: encryptedPayload,
            exp: expirationDate.getTime()
        }, this.jwtSecret);
    }

    async verify(jwtPayload, cb) {
        if (jwtPayload.exp < Date.now()) {
            return cb(Errors.tokenExpired());
        }
        let user;
        try {
            const decodedPayload = this.decrypt(jwtPayload.sub, this.key);
            user = JSON.parse(decodedPayload);
        } catch(e) {
            throw e;
        }
        let data;
        try {
            if (user.type === 'admin') {
                data = await Models.admin.findOne({ _id: user._id}).lean();
                data.type = 'admin';
            } else {
                data = await Models.users.findOne({ _id: user._id}).lean();
            }
        } catch(e) {
            return cb(e);
        }

        if (!data) {
            return cb(Errors.tokenExpired('Token expired please login again'));
        }

        if (data.devicesNumber > user.devicesNumber) {
            return cb(Errors.tokenExpired('User logged in on a different device'));
        }

        delete data.password;
        return cb(null, data);
    }
}

module.exports = JwtAuth;
