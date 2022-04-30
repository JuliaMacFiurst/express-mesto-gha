class AUTH_ERR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = AUTH_ERR;
