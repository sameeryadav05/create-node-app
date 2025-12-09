export default class ExpressError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error') {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
