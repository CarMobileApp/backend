class AppError extends Error {
    constructor() {
        super();
    }

    addStatusCode(statusCode) {
        this.statusCode = statusCode;
    }

    addCode(code) {
        this.code = code;
    }

    addMessage(message) {
        this.message = message;
    }
}

module.exports = AppError;
