
class ApiError {
    constructor(code, message) {
        this.status = code;
        this.message = message;
    }
    static handleError(status, message) {
        return new ApiError(status, message);
    }
}

module.exports = ApiError;