const httpConstans = require('http2').constants;

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpConstans.HTTP_STATUS_NOT_FOUND;
  }
};
