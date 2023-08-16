const httpConstans = require('http2').constants;

module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstans.HTTP_STATUS_UNAUTHORIZED;
  }
};
