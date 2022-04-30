class DEFAULT extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = DEFAULT;
