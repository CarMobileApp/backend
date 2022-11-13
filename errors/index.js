const AppError = require('./error');

const errors = {
    invalidRequest: (msg) => {
        let err = new AppError();
        err.addStatusCode(400);
        err.addCode('INVALID_REQUEST');
        err.addMessage(msg || 'Invalid Request');
        return err;
    },
    tokenExpired: (msg) => {
        let err = new AppError();
        err.addStatusCode(401);
        err.addCode('TOKEN_EXPIRED');
        err.addMessage(msg || 'Token Expired');
        return err;
    },
    invalidLogin: (msg) => {
        let err = new AppError();
        err.addStatusCode(401);
        err.addCode('INVALID_LOGIN');
        err.addMessage(msg || 'User mobile number and password do not match');
        return err;
    },
    userAlreadyRegistered: (msg) => {
        let err = new AppError();
        err.addStatusCode(400);
        err.addCode('ALREADY_REGISTERED');
        err.addMessage(msg || 'User already registered');
        return err;
    },
    notFound: (msg) => {
        let err = new AppError();
        err.addStatusCode(404);
        err.addCode('NOT_FOUND');
        err.addMessage(msg || 'Not found');
        return err;
    },
    invalidUser: (msg) => {
        let err = new AppError();
        err.addStatusCode(500);
        err.addCode('INVALID_USER');
        err.addMessage(msg || 'Invalid User');
        return err;
    },
    forbidden: (msg) => {
        let err = new AppError();
        err.addStatusCode(403);
        err.addCode('FORBIDDEN');
        err.addMessage(msg || 'You do not have enough access rights');
        return err;
    }
}

module.exports = errors;
